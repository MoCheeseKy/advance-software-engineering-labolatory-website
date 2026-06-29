'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm]        = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Login failed. Please try again.');
        return;
      }
      router.push(data.redirectUrl ?? '/admin');

    } catch {
      setError('Unable to reach the server. Check your connection.');
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        /* ── Floating icons background ── */
        .lp-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .lp-icon {
          position: absolute;
          opacity: 0.07;
          animation: floatY 6s ease-in-out infinite;
          color: #1a1a1a;
          user-select: none;
        }
        .lp-icon svg { display: block; }

        .lp-icon:nth-child(1)  { top:  4%; left:  5%; animation-delay: 0s;    animation-duration: 7s; }
        .lp-icon:nth-child(2)  { top:  8%; left: 22%; animation-delay: 1.2s;  animation-duration: 8s; }
        .lp-icon:nth-child(3)  { top:  3%; left: 42%; animation-delay: 0.5s;  animation-duration: 6s; }
        .lp-icon:nth-child(4)  { top:  6%; left: 62%; animation-delay: 1.8s;  animation-duration: 9s; }
        .lp-icon:nth-child(5)  { top:  5%; left: 80%; animation-delay: 0.3s;  animation-duration: 7s; }
        .lp-icon:nth-child(6)  { top: 25%; left:  2%; animation-delay: 2.1s;  animation-duration: 8s; }
        .lp-icon:nth-child(7)  { top: 22%; left: 88%; animation-delay: 0.9s;  animation-duration: 6s; }
        .lp-icon:nth-child(8)  { top: 45%; left:  4%; animation-delay: 1.5s;  animation-duration: 9s; }
        .lp-icon:nth-child(9)  { top: 42%; left: 91%; animation-delay: 0.6s;  animation-duration: 7s; }
        .lp-icon:nth-child(10) { top: 65%; left:  6%; animation-delay: 2.4s;  animation-duration: 8s; }
        .lp-icon:nth-child(11) { top: 62%; left: 85%; animation-delay: 1.1s;  animation-duration: 6s; }
        .lp-icon:nth-child(12) { top: 80%; left:  8%; animation-delay: 0.7s;  animation-duration: 9s; }
        .lp-icon:nth-child(13) { top: 82%; left: 30%; animation-delay: 1.9s;  animation-duration: 7s; }
        .lp-icon:nth-child(14) { top: 78%; left: 55%; animation-delay: 0.4s;  animation-duration: 8s; }
        .lp-icon:nth-child(15) { top: 83%; left: 75%; animation-delay: 1.6s;  animation-duration: 6s; }
        .lp-icon:nth-child(16) { top: 88%; left: 92%; animation-delay: 2.2s;  animation-duration: 9s; }
        .lp-icon:nth-child(17) { top: 14%; left: 12%; animation-delay: 1.3s;  animation-duration: 7s; }
        .lp-icon:nth-child(18) { top: 16%; left: 72%; animation-delay: 0.8s;  animation-duration: 8s; }
        .lp-icon:nth-child(19) { top: 55%; left: 14%; animation-delay: 2.0s;  animation-duration: 6s; }
        .lp-icon:nth-child(20) { top: 52%; left: 80%; animation-delay: 1.4s;  animation-duration: 9s; }
        .lp-icon:nth-child(21) { top: 35%; left: 18%; animation-delay: 0.2s;  animation-duration: 7s; }
        .lp-icon:nth-child(22) { top: 33%; left: 76%; animation-delay: 2.3s;  animation-duration: 8s; }
        .lp-icon:nth-child(23) { top: 70%; left: 45%; animation-delay: 1.0s;  animation-duration: 6s; }
        .lp-icon:nth-child(24) { top: 72%; left: 62%; animation-delay: 1.7s;  animation-duration: 7s; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(3deg); }
          66%       { transform: translateY(5px) rotate(-2deg); }
        }

        /* ── Card ── */
        .lp-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          margin: 40px 20px;
          background: #ffffff;
          border: 1.5px solid #e8e8e8;
          border-radius: 20px;
          padding: 44px 40px 36px;
          box-shadow:
            0 4px 6px rgba(0,0,0,.04),
            0 12px 40px rgba(0,0,0,.08);
        }

        /* ── Logo ── */
        .lp-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .lp-hex {
          width: 52px;
          height: 52px;
          background: #FF6B00;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
          flex-shrink: 0;
        }

        .lp-logo-text {
          text-align: center;
          line-height: 1.3;
        }
        .lp-logo-text strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #111;
          letter-spacing: .2px;
        }
        .lp-logo-text span {
          font-size: 11px;
          color: #aaa;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        /* divider */
        .lp-sep {
          height: 1px;
          background: #f0f0f0;
          margin: 0 -40px 28px;
        }

        /* heading */
        .lp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #FF6B00;
          margin-bottom: 4px;
        }
        .lp-title {
          font-size: 24px;
          font-weight: 800;
          color: #111;
          margin-bottom: 4px;
        }
        .lp-sub {
          font-size: 13px;
          color: #999;
          margin-bottom: 28px;
        }

        /* ── Form ── */
        .lp-field { margin-bottom: 16px; }

        .lp-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .4px;
          color: #555;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .lp-input-wrap { position: relative; }

        .lp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
          font-size: 15px;
          pointer-events: none;
        }

        .lp-input {
          width: 100%;
          background: #fafafa;
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          padding: 13px 44px;
          font-size: 14px;
          font-family: inherit;
          color: #111;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .lp-input::placeholder { color: #ccc; }
        .lp-input:focus {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255,107,0,.10);
          background: #fff;
        }

        .lp-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #bbb;
          font-size: 15px;
          padding: 4px;
          transition: color .15s;
        }
        .lp-toggle:hover { color: #FF6B00; }

        /* error */
        .lp-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,.06);
          border: 1px solid rgba(239,68,68,.2);
          border-radius: 8px;
          padding: 11px 13px;
          font-size: 13px;
          color: #ef4444;
          margin-bottom: 16px;
        }

        /* button */
        .lp-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #FF6B00;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .4px;
          cursor: pointer;
          transition: background .15s, transform .1s;
          margin-top: 6px;
        }
        .lp-btn:hover:not(:disabled) {
          background: #e05e00;
          transform: translateY(-1px);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: .5; cursor: not-allowed; }

        .lp-spinner {
          width: 17px;
          height: 17px;
          border: 2.5px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lp-footer {
          margin-top: 28px;
          font-size: 11px;
          color: #ccc;
          text-align: center;
          letter-spacing: .3px;
        }
        .lp-footer strong { color: #FF6B00; font-weight: 600; }
      `}</style>

      <div className="lp-root">

        {/* ── Floating background icons ── */}
        <div className="lp-bg">

          {/* Gamepad */}
          {[...Array(4)].map((_, i) => (
            <div key={`gp-${i}`} className="lp-icon" style={{ fontSize: [48,56,40,52][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 4H7a5 5 0 0 0-5 5v2a5 5 0 0 0 5 5h1l1 2h4l1-2h1a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5zM9 11H8v1a1 1 0 0 1-2 0v-1H5a1 1 0 0 1 0-2h1V9a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2zm6.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
            </div>
          ))}

          {/* Monitor */}
          {[...Array(4)].map((_, i) => (
            <div key={`mn-${i}`} className="lp-icon" style={{ fontSize: [52,44,60,48][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7v2H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H5V5h14v10z"/>
              </svg>
            </div>
          ))}

          {/* Code bracket */}
          {[...Array(4)].map((_, i) => (
            <div key={`cd-${i}`} className="lp-icon" style={{ fontSize: [44,60,48,56][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.293 6.293 2.586 12l5.707 5.707 1.414-1.414L5.414 12l4.293-4.293zm7.414 0-1.414 1.414L18.586 12l-4.293 4.293 1.414 1.414L21.414 12z"/>
              </svg>
            </div>
          ))}

          {/* Terminal */}
          {[...Array(4)].map((_, i) => (
            <div key={`tm-${i}`} className="lp-icon" style={{ fontSize: [48,52,44,56][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM5 6.414l3.707 3.707L5 13.828 6.414 15.24 10.12 11.53a1 1 0 0 0 0-1.413L6.414 5.001zm7 9.587h7v-2h-7z"/>
              </svg>
            </div>
          ))}

          {/* Database */}
          {[...Array(4)].map((_, i) => (
            <div key={`db-${i}`} className="lp-icon" style={{ fontSize: [44,56,48,52][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <ellipse cx="12" cy="6" rx="8" ry="3"/>
                <path d="M4 9c0 1.657 3.582 3 8 3s8-1.343 8-3v3c0 1.657-3.582 3-8 3s-8-1.343-8-3zm0 6c0 1.657 3.582 3 8 3s8-1.343 8-3v3c0 1.657-3.582 3-8 3s-8-1.343-8-3z"/>
              </svg>
            </div>
          ))}

          {/* Git branch */}
          {[...Array(4)].map((_, i) => (
            <div key={`gt-${i}`} className="lp-icon" style={{ fontSize: [52,44,56,48][i] + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a4 4 0 0 1-2-7.465V3H3v-.5A2.5 2.5 0 0 1 5.5 0H6v2h-.5A.5.5 0 0 0 5 2.5V3h.535A4.001 4.001 0 0 1 7 11zm10-5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a4 4 0 0 0 0-8 4 4 0 0 0 0 8zM7 11v6a4 4 0 0 0 8 0v-1.535A4.001 4.001 0 0 1 17 7v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
          ))}
        </div>

        {/* ── Login Card ── */}
        <div className="lp-card">

          {/* Logo */}
          <div className="lp-logo">
            <div className="lp-hex">A</div>
            <div className="lp-logo-text">
              <strong>Advanced Software Engineering</strong>
              <span>Laboratory</span>
            </div>
          </div>

          <div className="lp-sep" />

          <p className="lp-eyebrow">Admin Portal</p>
          <h2 className="lp-title">Sign in</h2>
          <p className="lp-sub">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} noValidate>

            {error && (
              <div className="lp-error">
                <FiAlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="lp-field">
              <label className="lp-label" htmlFor="username">Username</label>
              <div className="lp-input-wrap">
                <FiUser className="lp-input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="your_username"
                  className="lp-input"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="lp-field">
              <label className="lp-label" htmlFor="password">Password</label>
              <div className="lp-input-wrap">
                <FiLock className="lp-input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="lp-input"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="lp-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? <span className="lp-spinner" /> : 'Sign in to Dashboard'}
            </button>

          </form>

          <div className="lp-footer">
            © {new Date().getFullYear()} <strong>ASE Laboratory</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}