import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, upcomingRes, clubsRes, leaderboardRes] = await Promise.all([
          api.get('/events/trending'),
          api.get('/events?upcoming=true&sort=nearest'),
          api.get('/clubs'),
          api.get('/clubs/leaderboard')
        ]);
        setTrendingEvents(trendingRes.data);
        setUpcomingEvents(upcomingRes.data.slice(0, 6));
        setClubs(clubsRes.data.slice(0, 4));
        setLeaderboard(leaderboardRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookmark = async (eventId) => {
    if (!user) return;
    try { await api.post(`/bookmarks/${eventId}`); } catch (err) { console.error(err); }
  };

  const handleInterested = async (eventId) => {
    if (!user) return;
    try { await api.post(`/events/${eventId}/interested`); } catch (err) { console.error(err); }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Discover What's<br />
              <span className="gradient-text">Happening at NIT KKR</span>
            </h1>
            <p>
              Your one-stop portal to discover events, join clubs, and connect with the NIT Kurukshetra community.
              Never miss Techspardha, workshops, cultural fests, or club events again.
            </p>
            <div className="hero-actions">
              <Link to="/events">
                <button className="btn btn-primary btn-lg">
                  Explore Events <FiArrowRight />
                </button>
              </Link>
              {!user && (
                <Link to="/register">
                  <button className="btn btn-outline btn-lg">Join Now</button>
                </Link>
              )}
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">50+</div>
                <div className="hero-stat-label">Events</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">20+</div>
                <div className="hero-stat-label">Clubs</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">2K+</div>
                <div className="hero-stat-label">Students</div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Trending Events */}
      {trendingEvents.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title"><FiTrendingUp style={{ color: 'var(--accent)' }} /> Trending Events</h2>
              <p className="section-subtitle">Most popular events on campus right now</p>
            </div>
            <Link to="/events">
              <button className="btn btn-secondary btn-sm">View All <FiArrowRight /></button>
            </Link>
          </div>
          <div className="events-grid">
            {trendingEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onBookmark={user ? handleBookmark : null}
                onInterested={user ? handleInterested : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">📅 Upcoming Events</h2>
            <p className="section-subtitle">Don't miss what's coming next</p>
          </div>
          <Link to="/events">
            <button className="btn btn-secondary btn-sm">View All <FiArrowRight /></button>
          </Link>
        </div>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="events-grid">
            {upcomingEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onBookmark={user ? handleBookmark : null}
                onInterested={user ? handleInterested : null}
              />
            ))}
          </div>
        )}
      </section>

      {/* Clubs & Leaderboard */}
      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">🏛️ Featured Clubs</h2>
                <p className="section-subtitle">Join a community that matches your passion</p>
              </div>
              <Link to="/clubs">
                <button className="btn btn-secondary btn-sm">All Clubs <FiArrowRight /></button>
              </Link>
            </div>
            <div className="clubs-grid">
              {clubs.map(club => (
                <Link to={`/clubs/${club._id}`} key={club._id}>
                  <div className="card club-card">
                    <div className="club-card-logo" style={{ background: `linear-gradient(135deg, ${getCategoryGradient(club.category)})` }}>
                      {club.name?.charAt(0)}
                    </div>
                    <h3 className="club-card-name">{club.name}</h3>
                    <span className="club-card-category">{club.category}</span>
                    <p className="club-card-desc">{club.description}</p>
                    <div className="club-card-stats">
                      <div className="club-stat">
                        <div className="club-stat-value">{club.eventsHosted}</div>
                        <div className="club-stat-label">Events</div>
                      </div>
                      <div className="club-stat">
                        <div className="club-stat-value">{club.members?.length || 0}</div>
                        <div className="club-stat-label">Members</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}><FiAward style={{ color: '#eab308' }} /> Club Leaderboard</h2>
            <div className="card leaderboard">
              {leaderboard.map((club, i) => (
                <Link to={`/clubs/${club._id}`} key={club._id}>
                  <div className="leaderboard-item">
                    <div className={`leaderboard-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      #{club.rank}
                    </div>
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">{club.name}</div>
                      <div className="leaderboard-events">{club.eventsHosted} events · {club.memberCount} members</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const getCategoryGradient = (category) => {
  const gradients = {
    technical: '#6366f1, #8b5cf6',
    cultural: '#ec4899, #f43f5e',
    sports: '#10b981, #14b8a6',
    literary: '#14b8a6, #06b6d4',
    social: '#3b82f6, #6366f1',
    other: '#6b7280, #9ca3af'
  };
  return gradients[category] || gradients.other;
};

export default Home;
