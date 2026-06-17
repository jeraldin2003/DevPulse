import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Activity } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[420px] p-8 bg-white border border-slate-200/60 rounded-2xl shadow-md flex flex-col gap-6">
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 mb-3">
            <Activity strokeWidth={2.5} size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">DevPulse</h1>
          <p className="text-sm text-slate-500 mt-1">{mode === 'login' ? 'Welcome back — sign in to continue' : 'Create an account to get started'}</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
          <button
            type="button"
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium" role="alert">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium" role="status">
            <CheckCircle size={15} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-username" className="text-[11px] font-bold text-slate-500 uppercase">Username</label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2 border border-slate-205/60 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-11 py-2 border border-slate-205/60 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength (register only) */}
            {mode === 'register' && password.length > 0 && (
              <div className="mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((lvl) => {
                    let strengthClass = "bg-slate-100";
                    if (strength.level >= lvl) {
                      if (strength.level === 1) strengthClass = "bg-rose-500";
                      else if (strength.level === 2) strengthClass = "bg-amber-500";
                      else if (strength.level === 3) strengthClass = "bg-emerald-500";
                    }
                    return (
                      <div
                        key={lvl}
                        className={`flex-1 h-1 rounded-full ${strengthClass} transition-colors duration-300`}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">{strength.label}</div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={loading}
          > 
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
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
        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => switchMode('register')}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => switchMode('login')}>
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
