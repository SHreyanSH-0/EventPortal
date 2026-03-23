import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categories = ['', 'technical', 'cultural', 'sports', 'literary', 'social'];

  useEffect(() => {
    fetchClubs();
  }, [category]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const { data } = await api.get(`/clubs?${params}`);
      setClubs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleJoin = async (clubId) => {
    if (!user) return;
    try {
      await api.post(`/clubs/${clubId}/join`);
      fetchClubs();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const getCategoryGradient = (cat) => {
    const g = { technical: '#6366f1, #8b5cf6', cultural: '#ec4899, #f43f5e', sports: '#10b981, #14b8a6', literary: '#14b8a6, #06b6d4', social: '#3b82f6, #6366f1', other: '#6b7280, #9ca3af' };
    return g[cat] || g.other;
  };

  return (
    <div className="section" style={{ paddingTop: '6rem' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">🏛️ Campus Clubs</h2>
          <p className="section-subtitle">Find your community and join the movement</p>
        </div>
        {user && (
          <Link to="/create-club">
            <button className="btn btn-primary">Create Your Own Club</button>
          </Link>
        )}
      </div>

      <div className="filters-bar">
        <form className="search-box" onSubmit={(e) => { e.preventDefault(); fetchClubs(); }}>
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search clubs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>

      <div className="filter-pills" style={{ marginBottom: '2rem' }}>
        {categories.map(cat => (
          <button key={cat || 'all'} className={`filter-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
            {cat || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner"></div> : (
        <div className="clubs-grid">
          {clubs.map(club => (
            <div className="card club-card" key={club._id}>
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
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Link to={`/clubs/${club._id}`}>
                  <button className="btn btn-secondary btn-sm">View Details</button>
                </Link>
                {user && !club.members?.includes(user._id) && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleJoin(club._id)}>Join Club</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clubs;
