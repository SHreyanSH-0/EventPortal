import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.post('/auth/verify', { token });
        setMessage(data.message);
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
        setStatus('error');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="auth-page">
      <div className="hero-bg"></div>
      <div className="auth-card glass" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <h2>Verifying your email...</h2>
            <p className="auth-subtitle">Please wait a moment.</p>
            <div className="spinner" style={{ margin: '1.5rem auto' }}></div>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h2>Email Verified!</h2>
            <p className="auth-subtitle">{message}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
              Redirecting you to login in 3 seconds...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>❌</div>
            <h2>Verification Failed</h2>
            <p className="auth-subtitle" style={{ color: 'var(--danger)' }}>{message}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1.5rem', width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
