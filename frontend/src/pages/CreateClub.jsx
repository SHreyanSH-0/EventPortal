import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CreateClub = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'technical',
    contactEmail: user?.email || '',
    contactPhone: '',
    website: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    github: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        socialLinks: {
          website: form.website,
          instagram: form.instagram,
          twitter: form.twitter,
          linkedin: form.linkedin,
          github: form.github
        }
      };
      const { data } = await api.post('/clubs', payload);

      alert('📝 Club creation request sent! It is now pending super admin approval. You will receive a notification once approved.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '6rem', maxWidth: '700px', margin: '0 auto' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">🏛️ Create a New Club</h2>
          <p className="section-subtitle">Start your own club and become a Club Admin</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {user?.role === 'clubAdmin' && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            ⚠️ You are already a Club Admin. Creating a new club will update your managed club.
          </div>
        )}

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Club Name *</label>
            <input type="text" name="name" className="form-input" placeholder="e.g., CodeCraft Society" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-textarea" placeholder="What is your club about? What activities do you organize?" value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                <option value="technical">🖥️ Technical</option>
                <option value="cultural">🎭 Cultural</option>
                <option value="sports">🏆 Sports</option>
                <option value="literary">📚 Literary</option>
                <option value="social">🤝 Social</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input type="email" name="contactEmail" className="form-input" placeholder="club@campus.edu" value={form.contactEmail} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input type="text" name="contactPhone" className="form-input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={handleChange} />
          </div>

          <h4 style={{ fontFamily: 'Space Grotesk', margin: '1.5rem 0 1rem', color: 'var(--text-secondary)' }}>Social Links (optional)</h4>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🌐 Website</label>
              <input type="url" name="website" className="form-input" placeholder="https://yourclub.com" value={form.website} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">📸 Instagram</label>
              <input type="url" name="instagram" className="form-input" placeholder="https://instagram.com/..." value={form.instagram} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🐦 Twitter</label>
              <input type="url" name="twitter" className="form-input" placeholder="https://twitter.com/..." value={form.twitter} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">💼 LinkedIn</label>
              <input type="url" name="linkedin" className="form-input" placeholder="https://linkedin.com/company/..." value={form.linkedin} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🐙 GitHub</label>
            <input type="url" name="github" className="form-input" placeholder="https://github.com/..." value={form.github} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Club...' : '🚀 Create Club & Become Admin'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: 'var(--bg-hover)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--primary)' }}>What happens when you create a club?</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', lineHeight: 2, listStyle: 'disc' }}>
            <li>Your role upgrades to <strong>Club Admin</strong></li>
            <li>You get access to the <strong>Admin Panel</strong> in the navbar</li>
            <li>You can <strong>create, edit, and delete events</strong> for your club</li>
            <li>You can <strong>view registrations</strong> for your events</li>
            <li>You become the first member of your club</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;
