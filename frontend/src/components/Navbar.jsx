import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/clubs', label: 'Clubs' },
    { path: '/map', label: 'Map' },
    { path: '/calendar', label: 'Calendar' },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">NK</div>
          CampusX
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && authLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (user.role === 'clubAdmin' || user.role === 'admin') && adminLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <>
              <Link to="/profile">
                <button className="user-avatar-btn">
                  {user.name?.charAt(0)?.toUpperCase()}
                </button>
              </Link>
              <button className="theme-toggle" onClick={handleLogout} title="Logout">
                <FiLogOut />
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary btn-sm">Sign In</button>
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
