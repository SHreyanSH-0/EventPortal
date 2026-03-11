import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiEye, FiUserPlus, FiCheck, FiX, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import LocationPicker from '../components/LocationPicker';

const AdminPanel = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join requests state
  const [joinRequests, setJoinRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState('pending');
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '',
    category: 'technical', club: '', tags: '', maxParticipants: 100,
    posterImage: '', registrationLink: '',
    coordinatesLat: '29.9490', coordinatesLng: '76.8183'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tab === 'requests' && clubs.length > 0) {
      fetchJoinRequests();
    }
  }, [tab, requestFilter, clubs]);

  const fetchData = async () => {
    try {
      const [eventsRes, clubsRes] = await Promise.all([
        api.get('/events'),
        api.get('/clubs')
      ]);
      setEvents(eventsRes.data);
      setClubs(clubsRes.data);
      // Default club
      const userClub = clubsRes.data.find(c => c.admin?._id === user._id || c.admin === user._id);
      if (userClub) {
        setForm(f => ({ ...f, club: userClub._id }));
        // Fetch pending count
        try {
          const reqRes = await api.get(`/clubs/${userClub._id}/requests?status=pending`);
          setPendingCount(reqRes.data.length);
        } catch (err) { console.error(err); }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchJoinRequests = async () => {
    setRequestsLoading(true);
    try {
      const userClub = clubs.find(c => c.admin?._id === user._id || c.admin === user._id);
      if (!userClub) {
        setJoinRequests([]);
        return;
      }
      const { data } = await api.get(`/clubs/${userClub._id}/requests?status=${requestFilter}`);
      setJoinRequests(data);
      if (requestFilter === 'pending') {
        setPendingCount(data.length);
      }
    } catch (err) { console.error(err); }
    finally { setRequestsLoading(false); }
  };

  const handleApprove = async (clubId, requestId) => {
    try {
      await api.put(`/clubs/${clubId}/requests/${requestId}/approve`);
      fetchJoinRequests();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (clubId, requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    try {
      await api.put(`/clubs/${clubId}/requests/${requestId}/reject`);
      fetchJoinRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        maxParticipants: Number(form.maxParticipants),
        coordinates: { lat: Number(form.coordinatesLat), lng: Number(form.coordinatesLng) }
      };
      delete payload.coordinatesLat;
      delete payload.coordinatesLng;

      if (editingEvent) {
        await api.put(`/events/${editingEvent}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      location: event.location,
      category: event.category,
      club: event.club?._id || event.club,
      tags: event.tags?.join(', ') || '',
      maxParticipants: event.maxParticipants,
      posterImage: event.posterImage || '',
      registrationLink: event.registrationLink || '',
      coordinatesLat: String(event.coordinates?.lat || '28.6140'),
      coordinatesLng: String(event.coordinates?.lng || '77.2088')
    });
    setEditingEvent(event._id);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      fetchData();
    } catch (err) { alert('Failed to delete'); }
  };

  const viewRegistrations = async (event) => {
    setSelectedEvent(event);
    setTab('registrations');
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', date: '', time: '', location: '',
      category: 'technical', club: clubs[0]?._id || '', tags: '', maxParticipants: 100,
      posterImage: '', registrationLink: '',
      coordinatesLat: '29.9490', coordinatesLng: '76.8183'
    });
  };

  // Filter events for club admin
  const myEvents = user?.role === 'admin' ? events :
    events.filter(e => (e.createdBy?._id || e.createdBy) === user?._id);

  return (
    <div className="admin-panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">⚙️ Admin Panel</h2>
          <p className="section-subtitle">Manage your club events & membership</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditingEvent(null); setShowForm(true); }}>
          <FiPlus /> Create Event
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>My Events</button>
        <button className={`admin-tab ${tab === 'registrations' ? 'active' : ''}`} onClick={() => setTab('registrations')}>Registrations</button>
        <button className={`admin-tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')} style={{ position: 'relative' }}>
          <FiUserPlus style={{ marginRight: '0.3rem' }} /> Join Requests
          {pendingCount > 0 && (
            <span className="notification-badge">{pendingCount}</span>
          )}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: '1.5rem' }}>
            {editingEvent ? '✏️ Edit Event' : '🎉 Create New Event'}
          </h3>
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="text" className="form-input" placeholder="10:00 AM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['technical', 'cultural', 'sports', 'workshop', 'seminar', 'hackathon', 'fest', 'other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Club</label>
                <select className="form-select" value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} required>
                  <option value="">Select Club</option>
                  {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Max Participants</label>
                <input type="number" className="form-input" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input type="text" className="form-input" placeholder="AI, Coding, Workshop" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Poster Image URL</label>
                <input type="text" className="form-input" placeholder="https://..." value={form.posterImage} onChange={(e) => setForm({ ...form, posterImage: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Link</label>
                <input type="text" className="form-input" placeholder="https://forms.google.com/..." value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">📍 Event Location on Map</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Click on the map or select a campus venue to set the event location and coordinates.
              </p>
              <LocationPicker
                lat={form.coordinatesLat}
                lng={form.coordinatesLng}
                locationName={form.location}
                onSelect={({ lat, lng, name }) => {
                  setForm(f => ({
                    ...f,
                    coordinatesLat: lat,
                    coordinatesLng: lng,
                    ...(name ? { location: name } : {})
                  }));
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingEvent(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {tab === 'events' && (
        <div>
          {loading ? <div className="spinner"></div> : myEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No events yet</h3>
              <p>Create your first event to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myEvents.map(event => (
                <div className="card" style={{ padding: '1.25rem' }} key={event._id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                        <span className="tag" style={{ background: `${getCatColor(event.category)}20`, color: getCatColor(event.category), border: 'none' }}>
                          {event.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.club?.name}</span>
                      </div>
                      <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '0.3rem' }}>{event.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        📅 {formatDate(event.date)} · {event.time} · 📍 {event.location}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        👥 {event.registeredUsers?.length || event.attendees || 0} / {event.maxParticipants} registered
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => viewRegistrations(event)} title="View Registrations">
                        <FiUsers /> {event.registeredUsers?.length || 0}
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(event)} title="Edit">
                        <FiEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registrations */}
      {tab === 'registrations' && selectedEvent && (
        <div>
          <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: '1.5rem' }}>
            Registrations for: {selectedEvent.title}
          </h3>
          {selectedEvent.registeredUsers?.length > 0 ? (
            <div className="registered-list">
              {selectedEvent.registeredUsers.map((u, i) => (
                <div className="registered-item" key={i}>
                  <div className="registered-avatar">{(u.name || u)?.toString().charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{u.name || 'Student'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email || ''} · {u.department || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👀</div>
              <h3>No registrations yet</h3>
            </div>
          )}
        </div>
      )}

      {/* Join Requests Tab */}
      {tab === 'requests' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontFamily: 'Space Grotesk' }}>
              <FiUserPlus style={{ marginRight: '0.5rem' }} />
              Club Join Requests
            </h3>
            <div className="request-filter-tabs">
              {['pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  className={`request-filter-btn ${requestFilter === status ? 'active' : ''}`}
                  onClick={() => setRequestFilter(status)}
                >
                  {status === 'pending' && <FiClock />}
                  {status === 'approved' && <FiCheckCircle />}
                  {status === 'rejected' && <FiXCircle />}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {requestsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>
          ) : joinRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {requestFilter === 'pending' ? '📋' : requestFilter === 'approved' ? '✅' : '❌'}
              </div>
              <h3>No {requestFilter} requests</h3>
              <p>
                {requestFilter === 'pending'
                  ? "You're all caught up! No pending requests to review."
                  : `No ${requestFilter} requests to show.`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {joinRequests.map(request => (
                <div className="card join-request-card" key={request._id}>
                  <div className="join-request-card-content">
                    <div className="join-request-user-info">
                      <div className="registered-avatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
                        {request.user?.name?.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Space Grotesk' }}>
                          {request.user?.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {request.user?.email}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                          {request.user?.department && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              🏛️ {request.user.department}
                            </span>
                          )}
                          {request.user?.yearOfStudy && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              📚 Year {request.user.yearOfStudy}
                            </span>
                          )}
                        </div>
                        {request.user?.skills?.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {request.user.skills.slice(0, 5).map((skill, i) => (
                              <span key={i} className="tag" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{skill}</span>
                            ))}
                          </div>
                        )}
                        {request.message && (
                          <div className="join-request-message">
                            <strong>Message:</strong> "{request.message}"
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          Requested {new Date(request.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="join-request-actions">
                      {request.status === 'pending' ? (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleApprove(request.club, request._id)}
                            title="Approve"
                          >
                            <FiCheck /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(request.club, request._id)}
                            title="Reject"
                          >
                            <FiX /> Reject
                          </button>
                        </>
                      ) : (
                        <div className={`request-status-badge ${request.status}`}>
                          {request.status === 'approved' ? <FiCheckCircle /> : <FiXCircle />}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const getCatColor = (category) => {
  const colors = { technical: '#6366f1', cultural: '#ec4899', sports: '#10b981', workshop: '#f59e0b', seminar: '#8b5cf6', hackathon: '#ef4444', fest: '#f97316', other: '#6b7280' };
  return colors[category] || colors.other;
};

export default AdminPanel;
