import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import './LoginPage.css';

function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak' };
  if (score <= 3) return { level: 2, label: 'Medium' };
  return { level: 3, label: 'Strong' };
}

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  }, []);

  const validate = () => {
    if (!username.trim()) {
      setError('Please enter a username.');
      return false;
    }
    if (!password) {
      setError('Please enter a password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);

    try {
      if (mode === 'register') {
        const result = await register(username.trim(), password);
        if (result.success) {
          setSuccess('Account created! Signing you in...');
          // Auto-login after registration
          const loginResult = await login(username.trim(), password);
          if (!loginResult.success) {
            setSuccess('');
            setError(loginResult.error || 'Registration succeeded, but auto-login failed. Please sign in manually.');
            setMode('login');
          }
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      } else {
        const result = await login(username.trim(), password);
        if (!result.success) {
          setError(result.error || 'Invalid credentials. Please try again.');
        }
      }
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const strength = mode === 'register' ? getPasswordStrength(password) : null;

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg" />
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />
      <div className="login-grid-overlay" />

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Activity strokeWidth={2.5} />
          </div>
          <h1>DevPulse</h1>
          <p>{mode === 'login' ? 'Welcome back — sign in to continue' : 'Create an account to get started'}</p>
        </div>

        {/* Toggle */}
        <div className="login-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="login-success" role="status">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-username">Username</label>
            <div className="login-input-wrapper">
              <User size={16} className="login-input-icon" />
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrapper">
              <Lock size={16} className="login-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength (register only) */}
            {mode === 'register' && password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1, 2, 3].map((lvl) => (
                    <div
                      key={lvl}
                      className={`password-strength-bar${
                        strength.level >= lvl ? ' active' : ''
                      }${strength.level >= 2 ? ' medium' : ''}${
                        strength.level >= 3 ? ' strong' : ''
                      }`}
                    />
                  ))}
                </div>
                <div className="password-strength-label">{strength.label}</div>
              </>
            )}
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading && <span className="login-btn-spinner" />}
            {loading
              ? mode === 'register'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'register'
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => switchMode('register')}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
