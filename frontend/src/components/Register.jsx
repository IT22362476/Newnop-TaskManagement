/**
 * Register Component
 * Registration form with optional admin secret code field.
 * If an ADMIN_SECRET is configured on the server, passing it here
 * creates the user with the 'admin' role.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
  });
  const [showAdminField, setShowAdminField] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) clearError();
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      // Only send adminSecret if the user filled it in
      if (form.adminSecret) {
        payload.adminSecret = form.adminSecret;
      }
      await register(payload.name, payload.email, payload.password, payload.adminSecret);
      navigate('/dashboard');
    } catch {
      // error is set in context
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {displayError && <div className="alert alert-error">{displayError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat password"
            />
          </div>

          {/* Admin registration toggle */}
          <div className="form-group admin-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAdminField}
                onChange={(e) => {
                  setShowAdminField(e.target.checked);
                  if (!e.target.checked) setForm((prev) => ({ ...prev, adminSecret: '' }));
                }}
              />
              <span>Register as admin</span>
            </label>
          </div>

          {showAdminField && (
            <div className="form-group">
              <label htmlFor="adminSecret">Admin Secret Code</label>
              <input
                id="adminSecret"
                name="adminSecret"
                type="password"
                value={form.adminSecret}
                onChange={handleChange}
                placeholder="Enter admin registration code"
              />
              <p className="form-hint">Ask your administrator for the secret code.</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
