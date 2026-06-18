import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Lock, Eye, EyeOff, Mail, ShieldCheck, AlertCircle, CheckCircle, Activity, Send } from 'lucide-react';

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

const OTP_COOLDOWN = 60; // seconds

export default function LoginPage() {
  const { login, register, sendOtp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Shared fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register-only fields
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const [loading, setLoading]       = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  // Clean up cooldown timer on unmount
  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setCooldown(0);
    clearInterval(cooldownRef.current);
  }, []);

  const startCooldown = () => {
    setCooldown(OTP_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address before sending OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendOtp(email.trim());
      if (result.success) {
        setOtpSent(true);
        setSuccess('OTP sent! Check your inbox (and spam folder).');
        startCooldown();
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setOtpLoading(false);
    }
  };

  const validate = () => {
    if (!username.trim()) { setError('Please enter a username.'); return false; }
    if (!password) { setError('Please enter a password.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    if (mode === 'register') {
      if (!email.trim()) { setError('Email is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return false; }
      if (!otpSent) { setError('Please send and verify the OTP before registering.'); return false; }
      if (!otp.trim()) { setError('Please enter the OTP sent to your email.'); return false; }
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
        const result = await register(username.trim(), password, email.trim(), otp.trim());
        if (result.success) {
          setSuccess('Account created! Signing you in…');
          const loginResult = await login(username.trim(), password);
          if (!loginResult.success) {
            setSuccess('');
            setError(loginResult.error || 'Registration succeeded but auto-login failed. Please sign in manually.');
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
      <div className="relative z-10 w-full max-w-[440px] p-8 bg-white border border-slate-200/60 rounded-2xl shadow-md flex flex-col gap-6">

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20 mb-3">
            <Activity strokeWidth={2.5} size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">DevPulse</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' ? 'Welcome back — sign in to continue' : 'Create an account to get started'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer capitalize ${
                mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => switchMode(m)}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-username" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="auth-username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email (register only) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Email <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex items-center flex-1">
                  <Mail size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setOtpSent(false); setOtp(''); }}
                    disabled={loading || otpLoading}
                  />
                </div>
                <button
                  type="button"
                  id="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={loading || otpLoading || cooldown > 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                >
                  {otpLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  {cooldown > 0 ? `${cooldown}s` : otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>
          )}

          {/* OTP input (register only, after OTP sent) */}
          {mode === 'register' && otpSent && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-otp" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-blue-500" />
                Verification Code
              </label>
              <div className="relative flex items-center">
                <ShieldCheck size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="auth-otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm bg-blue-50/30 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60 tracking-widest font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-0.5">Enter the 6-digit code sent to <strong>{email}</strong></p>
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-11 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
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
                    let cls = 'bg-slate-100';
                    if (strength.level >= lvl) {
                      if (strength.level === 1) cls = 'bg-rose-500';
                      else if (strength.level === 2) cls = 'bg-amber-500';
                      else cls = 'bg-emerald-500';
                    }
                    return <div key={lvl} className={`flex-1 h-1 rounded-full ${cls} transition-colors duration-300`} />;
                  })}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">{strength.label}</div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading
              ? mode === 'register' ? 'Creating account…' : 'Signing in…'
              : mode === 'register' ? 'Create Account' : 'Sign In'}
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
