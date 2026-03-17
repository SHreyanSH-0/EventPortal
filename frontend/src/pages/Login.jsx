import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotVerified(false);
    setResendMsg('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403) {
        setNotVerified(true);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/resend', { email });
      setResendMsg(data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="hero-bg"></div>
      <div className="auth-card glass">
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your NIT-KKR Connect account</p>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {notVerified && (
          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📧</span>
              <strong style={{ color: 'var(--warning, #ca8a04)', fontSize: '0.9rem' }}>Email not verified</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
              Please verify <strong>{email}</strong> before logging in.
            </p>
            {resendMsg ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--primary)', margin: 0 }}>{resendMsg}</p>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                onClick={handleResend}
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@nitkkr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Demo Credentials</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.8 }}>
          Admin: admin@nitkkr.ac.in / admin123<br />
          Club Admin: rahul@nitkkr.ac.in / student123<br />
          Student: aarav@nitkkr.ac.in / student123
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
