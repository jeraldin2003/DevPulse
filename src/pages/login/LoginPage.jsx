import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  User, Lock, Eye, EyeOff, Mail, ShieldCheck,
  AlertCircle, CheckCircle, Activity, Send, KeyRound, ArrowLeft,
} from 'lucide-react';

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

const OTP_COOLDOWN = 60;

// ─── Modes: 'login' | 'register' | 'forgot' ──────────────────────────────────
// Forgot sub-steps: 1 = enter email, 2 = enter OTP, 3 = set new password

export default function LoginPage() {
  const { login, loginByEmail, register, sendOtp, forgotPassword, resetPassword } = useAuth();

  const [mode, setMode]       = useState('login');
  const [forgotStep, setForgotStep] = useState(1);

  // Shared fields
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regEmail, setRegEmail]     = useState('');
  const [regOtp, setRegOtp]         = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);

  // Forgot-password fields
  const [fpEmail, setFpEmail]           = useState('');
  const [fpOtp, setFpOtp]               = useState('');
  const [fpNewPassword, setFpNewPassword]       = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [showFpPassword, setShowFpPassword]     = useState(false);

  // OTP cooldown (shared by register + forgot step 1)
  const [cooldown, setCooldown]     = useState(0);
  const cooldownRef                 = useRef(null);

  const [loading, setLoading]       = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  const startCooldown = () => {
    setCooldown(OTP_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const resetAll = useCallback(() => {
    setError(''); setSuccess('');
    setUsername(''); setPassword(''); setShowPassword(false);
    setRegEmail(''); setRegOtp(''); setRegOtpSent(false);
    setFpEmail(''); setFpOtp(''); setFpNewPassword(''); setFpConfirmPassword('');
    setForgotStep(1); setCooldown(0);
    clearInterval(cooldownRef.current);
  }, []);

  const switchMode = useCallback((m) => {
    resetAll();
    setMode(m);
  }, [resetAll]);

  // ─── Register: Send OTP ──────────────────────────────────────────────────────
  const handleRegSendOtp = async () => {
    setError('');
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError('Please enter a valid email address before sending OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendOtp(regEmail.trim());
      if (result.success) {
        setRegOtpSent(true);
        setSuccess('OTP sent! Check your inbox (and spam folder).');
        startCooldown();
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch { setError('Network error. Make sure the server is running.'); }
    finally { setOtpLoading(false); }
  };

  // ─── Forgot: Step 1 — Send reset OTP ─────────────────────────────────────────
  const handleFpSendOtp = async () => {
    setError('');
    if (!fpEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await forgotPassword(fpEmail.trim());
      if (result.success) {
        setSuccess('If that email is registered, a reset code has been sent.');
        setForgotStep(2);
        startCooldown();
      } else {
        setError(result.error || 'Failed to send reset code.');
      }
    } catch { setError('Network error. Make sure the server is running.'); }
    finally { setOtpLoading(false); }
  };

  // ─── Forgot: Step 2 — Verify OTP ─────────────────────────────────────────────
  const handleFpVerifyOtp = () => {
    setError('');
    if (!fpOtp.trim() || fpOtp.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }
    setForgotStep(3);
    setSuccess('');
  };

  // ─── Forgot: Step 3 — Set new password ────────────────────────────────────────
  const handleFpReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!fpNewPassword || fpNewPassword.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(fpEmail.trim(), fpOtp.trim(), fpNewPassword);
      if (result.success) {
        setSuccess('Password reset successfully! You can now sign in.');
        setTimeout(() => switchMode('login'), 2000);
      } else {
        setError(result.error || 'Password reset failed. Please try again.');
      }
    } catch { setError('Network error. Make sure the server is running.'); }
    finally { setLoading(false); }
  };

  // ─── Login / Register submit ──────────────────────────────────────────────────
  const validate = () => {
    if (!username.trim()) { setError('Please enter a username.'); return false; }
    if (!password) { setError('Please enter a password.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    if (mode === 'register') {
      if (!regEmail.trim()) { setError('Email is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) { setError('Please enter a valid email.'); return false; }
      if (!regOtpSent) { setError('Please send and verify the OTP first.'); return false; }
      if (!regOtp.trim()) { setError('Please enter the OTP sent to your email.'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'register') {
        const result = await register(username.trim(), password, regEmail.trim(), regOtp.trim());
        if (result.success) {
          setSuccess('Account created! Signing you in…');
          const lr = await login(username.trim(), password);
          if (!lr.success) {
            setSuccess('');
            setError(lr.error || 'Registration succeeded but auto-login failed. Please sign in manually.');
            switchMode('login');
          }
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      } else {
        // Step 1 — try username + password
        const result = await login(username.trim(), password);
        if (!result.success) {
          // Step 2 — treat the typed username as an email and retry
          const emailResult = await loginByEmail(username.trim(), password);
          if (!emailResult.success) {
            setError(result.error || 'Invalid credentials. Please try again.');
          }
        }
      }
    } catch { setError('Network error. Make sure the server is running.'); }
    finally { setLoading(false); }
  };

  const strength = mode === 'register' ? getPasswordStrength(password) : null;
  const fpStrength = getPasswordStrength(fpNewPassword);

  // ─── Forgot password card content ────────────────────────────────────────────
  const renderForgotFlow = () => (
    <div className="flex flex-col gap-5">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              forgotStep >= s ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>{s}</div>
            {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${forgotStep > s ? 'bg-amber-400' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider -mt-1">
        {forgotStep === 1 && 'Step 1 — Enter your registered email'}
        {forgotStep === 2 && 'Step 2 — Enter the reset code'}
        {forgotStep === 3 && 'Step 3 — Set your new password'}
      </p>

      {/* Step 1 */}
      {forgotStep === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-email" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <div className="flex gap-2">
              <div className="relative flex items-center flex-1">
                <Mail size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="fp-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  disabled={otpLoading}
                />
              </div>
              <button
                type="button"
                id="fp-send-otp-btn"
                onClick={handleFpSendOtp}
                disabled={otpLoading || cooldown > 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {otpLoading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={13} />}
                {cooldown > 0 ? `${cooldown}s` : 'Send Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {forgotStep === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-otp" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-amber-500" /> Reset Code
            </label>
            <div className="relative flex items-center">
              <ShieldCheck size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className="w-full pl-10 pr-4 py-2 border border-amber-300 bg-amber-50/30 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-700 placeholder:text-slate-400 tracking-widest font-mono"
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
              />
            </div>
            <p className="text-[10px] text-slate-400 ml-0.5">Sent to <strong>{fpEmail}</strong></p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setForgotStep(1); setFpOtp(''); setError(''); setSuccess(''); }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              id="fp-verify-otp-btn"
              onClick={handleFpVerifyOtp}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer"
            >
              Verify Code →
            </button>
          </div>
          {cooldown > 0 ? (
            <p className="text-[10px] text-center text-slate-400">Resend available in {cooldown}s</p>
          ) : (
            <button type="button" className="text-[10px] text-center text-amber-600 hover:underline cursor-pointer" onClick={() => { setForgotStep(1); setFpOtp(''); setError(''); setSuccess(''); }}>
              Didn&apos;t receive the code? Go back to resend
            </button>
          )}
        </div>
      )}

      {/* Step 3 */}
      {forgotStep === 3 && (
        <form className="flex flex-col gap-4" onSubmit={handleFpReset}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-new-password" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="fp-new-password"
                type={showFpPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full pl-10 pr-11 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                value={fpNewPassword}
                onChange={(e) => setFpNewPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button type="button" tabIndex={-1} className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 flex items-center cursor-pointer"
                onClick={() => setShowFpPassword(!showFpPassword)}>
                {showFpPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {fpNewPassword.length > 0 && (
              <div className="mt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3].map((lvl) => {
                    let cls = 'bg-slate-100';
                    if (fpStrength.level >= lvl) {
                      if (fpStrength.level === 1) cls = 'bg-rose-500';
                      else if (fpStrength.level === 2) cls = 'bg-amber-500';
                      else cls = 'bg-emerald-500';
                    }
                    return <div key={lvl} className={`flex-1 h-1 rounded-full ${cls} transition-colors duration-300`} />;
                  })}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1 font-medium">{fpStrength.label}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fp-confirm-password" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="fp-confirm-password"
                type={showFpPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-1 text-slate-700 placeholder:text-slate-400 disabled:opacity-60 transition-colors ${
                  fpConfirmPassword && fpConfirmPassword !== fpNewPassword
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:border-amber-400 focus:ring-amber-400'
                }`}
                value={fpConfirmPassword}
                onChange={(e) => setFpConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {fpConfirmPassword && fpConfirmPassword === fpNewPassword && (
                <CheckCircle size={14} className="absolute right-3.5 text-emerald-500" />
              )}
            </div>
          </div>

          <button
            type="submit"
            id="fp-reset-btn"
            disabled={loading}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-[440px] p-8 bg-white border border-slate-200/60 rounded-2xl shadow-md flex flex-col gap-6">

        {/* Brand */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-sm mb-3 transition-colors duration-300 ${mode === 'forgot' ? 'bg-amber-500 shadow-amber-400/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
            {mode === 'forgot' ? <KeyRound strokeWidth={2.5} size={22} /> : <Activity strokeWidth={2.5} size={24} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {mode === 'forgot' ? 'Reset Password' : 'DevPulse'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' && 'Welcome back — sign in to continue'}
            {mode === 'register' && 'Create an account to get started'}
            {mode === 'forgot' && 'We\'ll send a code to your registered email'}
          </p>
        </div>

        {/* Mode Toggle (login / register only) */}
        {mode !== 'forgot' && (
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
        )}

        {/* Back to login (forgot mode) */}
        {mode === 'forgot' && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer w-fit -mt-2 transition-colors"
            onClick={() => switchMode('login')}
          >
            <ArrowLeft size={13} /> Back to Sign In
          </button>
        )}

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

        {/* ── FORGOT PASSWORD FLOW ── */}
        {mode === 'forgot' && renderForgotFlow()}

        {/* ── LOGIN / REGISTER FORM ── */}
        {mode !== 'forgot' && (
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

            {/* Email + OTP (register only) */}
            {mode === 'register' && (
              <>
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
                        value={regEmail}
                        onChange={(e) => { setRegEmail(e.target.value); setRegOtpSent(false); setRegOtp(''); }}
                        disabled={loading || otpLoading}
                      />
                    </div>
                    <button
                      type="button"
                      id="send-otp-btn"
                      onClick={handleRegSendOtp}
                      disabled={loading || otpLoading || cooldown > 0}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                    >
                      {otpLoading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={13} />}
                      {cooldown > 0 ? `${cooldown}s` : regOtpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {regOtpSent && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="auth-otp" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-blue-500" /> Verification Code
                    </label>
                    <div className="relative flex items-center">
                      <ShieldCheck size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="auth-otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm bg-blue-50/30 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 tracking-widest font-mono"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-0.5">Sent to <strong>{regEmail}</strong></p>
                  </div>
                )}
              </>
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
              {mode === 'register' && password.length > 0 && (
                <div className="mt-0.5">
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

            {/* Forgot password link (login only) */}
            {mode === 'login' && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  id="forgot-password-link"
                  className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
                  onClick={() => switchMode('forgot')}
                >
                  Forgot password?
                </button>
              </div>
            )}

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
        )}

        {/* Footer */}
        {mode !== 'forgot' && (
          <div className="text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>Don&apos;t have an account?{' '}
                <button type="button" className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => switchMode('register')}>Register</button>
              </span>
            ) : (
              <span>Already have an account?{' '}
                <button type="button" className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => switchMode('login')}>Sign In</button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
