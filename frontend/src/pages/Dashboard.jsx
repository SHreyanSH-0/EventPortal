import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiBookmark, FiUsers, FiStar, FiActivity } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [myPendingClubs, setMyPendingClubs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, bookmarksRes, eventsRes, pendingClubsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/bookmarks'),
        api.get('/events?upcoming=true&sort=nearest'),
        api.get('/clubs/my-pending')
      ]);

      setUserProfile(profileRes.data);
      setBookmarkedEvents(bookmarksRes.data);
      setMyPendingClubs(pendingClubsRes.data);

      // Filter registered events
      const registered = eventsRes.data.filter(e =>
        e.registeredUsers?.some(u => u === user._id || u._id === user._id)
      );
      setRegisteredEvents(registered);

      // Fetch recommended
      try {
        const recRes = await api.get('/events/user/recommended');
        setRecommendedEvents(recRes.data);
      } catch (err) {
        setRecommendedEvents(eventsRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="dashboard-subtext">Here's what's happening on campus today</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-icon">📅</div>
          <div className="stat-card-value">{registeredEvents.length}</div>
          <div className="stat-card-label">Registered Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🔖</div>
          <div className="stat-card-value">{bookmarkedEvents.length}</div>
          <div className="stat-card-label">Bookmarked</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🏛️</div>
          <div className="stat-card-value">{userProfile?.clubsJoined?.length || 0}</div>
          <div className="stat-card-label">Clubs Joined</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-value">{userProfile?.eventsAttended?.length || 0}</div>
          <div className="stat-card-label">Events Attended</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div>
          {/* Registered Events */}
          <div className="dash-section">
            <h3 className="dash-section-title"><FiCalendar /> Your Upcoming Events</h3>
            {registeredEvents.length > 0 ? (
              <div className="events-grid">
                {registeredEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="empty-state glass-sm">
                <div className="empty-state-icon">📭</div>
                <h3>No upcoming events</h3>
                <p>Browse and register for events to see them here</p>
                <Link to="/events"><button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Events</button></Link>
              </div>
            )}
          </div>

          {/* Recommended */}
          <div className="dash-section">
            <h3 className="dash-section-title"><FiStar /> Recommended For You</h3>
            {recommendedEvents.length > 0 ? (
              <div className="events-grid">
                {recommendedEvents.slice(0, 4).map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="empty-state glass-sm">
                <div className="empty-state-icon">🎯</div>
                <h3>Update your interests</h3>
                <p>Add interests to your profile for personalized recommendations</p>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Bookmarked */}
          <div className="dash-section">
            <h3 className="dash-section-title"><FiBookmark /> Bookmarked Events</h3>
            {bookmarkedEvents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {bookmarkedEvents.slice(0, 5).map(event => (
                  <Link to={`/events/${event._id}`} key={event._id}>
                    <div className="map-event-item glass-sm">
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{event.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(event.date).toLocaleDateString()} · {event.location}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state glass-sm">
                <div className="empty-state-icon">🔖</div>
                <h3>No bookmarks yet</h3>
              </div>
            )}
          </div>

          {/* Clubs */}
          <div className="dash-section">
            <h3 className="dash-section-title"><FiUsers /> Your Clubs</h3>
            {userProfile?.clubsJoined?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {userProfile.clubsJoined.map(club => (
                  <Link to={`/clubs/${club._id}`} key={club._id}>
                    <div className="map-event-item glass-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="registered-avatar">{club.name?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{club.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{club.category}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state glass-sm">
                <div className="empty-state-icon">🏛️</div>
                <h3>Not in any clubs</h3>
                <Link to="/clubs"><button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Browse Clubs</button></Link>
              </div>
            )}
          </div>
          
          {/* Pending Club Creation Requests */}
          {myPendingClubs.length > 0 && (
            <div className="dash-section" style={{ marginTop: '2rem' }}>
              <h3 className="dash-section-title">🏛️ Pending Club Applications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myPendingClubs.map(club => (
                  <div key={club._id} className="map-event-item glass-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '4px solid var(--warning)' }}>
                    <div className="registered-avatar">{club.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{club.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>Awaiting Admin Approval</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
