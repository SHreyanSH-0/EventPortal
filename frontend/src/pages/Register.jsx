import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', department: '', yearOfStudy: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setEmailSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/resend', { email: formData.email });
      setResendMsg(data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="hero-bg"></div>
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
          <h2>Check your email!</h2>
          <p className="auth-subtitle">
            We sent a verification link to <strong>{formData.email}</strong>. Click the link in the email to activate your account.
          </p>
          {resendMsg && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontSize: '0.85rem' }}>
              {resendMsg}
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem', width: '100%' }}
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend verification email'}
          </button>
          <div className="auth-footer" style={{ marginTop: '1rem' }}>
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="hero-bg"></div>
      <div className="auth-card glass">
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
        </div>
        <h2>Join NIT-KKR Connect</h2>
        <p className="auth-subtitle">Create your account and start exploring NIT Kurukshetra events</p>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="Aarav Sharma" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@nitkkr.ac.in" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                <option value="">Select Department</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Industrial & Production">Industrial & Production</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select name="yearOfStudy" className="form-select" value={formData.yearOfStudy} onChange={handleChange}>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
