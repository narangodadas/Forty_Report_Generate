/**
 * PasswordGate.jsx
 * Shows when current time is outside 16:00–20:00 (4 PM – 8 PM).
 * Requires password FIT_NOC to proceed.
 * Shows live countdown to next open window.
 */

import { useState, useEffect, useRef } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

const CORRECT_PASSWORD = "FIT_NOC";

/** Returns { allowed, nextOpenMs }
 *  allowed    — true if 16:00 ≤ now < 20:00
 *  nextOpenMs — ms until the next 16:00 window opens
 */
function getAccessState() {
  const now   = new Date();
  const h     = now.getHours();
  const m     = now.getMinutes();
  const s     = now.getSeconds();
  const totalMinutes = h * 60 + m;

  const allowed = totalMinutes >= 16 * 60 && totalMinutes < 20 * 60;

  // ms until next 16:00
  let nextOpen;
  if (totalMinutes < 16 * 60) {
    // same day 16:00
    const secsTill = (16 * 60 - totalMinutes) * 60 - s;
    nextOpen = secsTill * 1000;
  } else {
    // tomorrow 16:00
    const secsTillMidnight = (24 * 60 - totalMinutes) * 60 - s;
    const secsTill4pm      = 16 * 60 * 60;
    nextOpen = (secsTillMidnight + secsTill4pm) * 1000;
  }

  return { allowed, nextOpenMs: nextOpen };
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return [hh, mm, ss].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword]   = useState("");
  const [show, setShow]           = useState(false);
  const [error, setError]         = useState("");
  const [shaking, setShaking]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef(null);

  // Live countdown tick
  useEffect(() => {
    const tick = () => {
      const { nextOpenMs } = getAccessState();
      setCountdown(nextOpenMs);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError("");
      setSuccess(true);
      setTimeout(() => onUnlock(), 900);
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="gate-root">
      {/* Animated background */}
      <div className="gate-bg-orb gate-orb-1" />
      <div className="gate-bg-orb gate-orb-2" />
      <div className="gate-bg-orb gate-orb-3" />

      <div className="gate-card-wrap">
        <div className={`gate-card ${shaking ? "gate-shake" : ""} ${success ? "gate-success-anim" : ""}`}>

          {/* Top icon */}
          <div className="gate-icon-ring">
            {success
              ? <ShieldCheck size={28} className="gate-icon-success" />
              : <Lock size={28} className="gate-icon-lock" />
            }
          </div>

          {/* Heading */}
          <h1 className="gate-title">
            {success ? "Access Granted" : "Restricted Access"}
          </h1>
          <p className="gate-subtitle">
            {success
              ? "Redirecting to dashboard…"
              : "This system is available between 4:00 PM – 8:00 PM. Enter the NOC password to continue."
            }
          </p>

          {/* Countdown card */}
          {!success && (
            <div className="gate-countdown-card">
              <div className="gate-countdown-header">
                <Clock size={13} />
                <span>Next open window in</span>
              </div>
              <div className="gate-countdown-time">
                {formatCountdown(countdown)}
              </div>
              <div className="gate-countdown-sub">
                Free access resumes at <strong>4:00 PM</strong> today
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="gate-form" noValidate>
              <div className="gate-field">
                <label className="gate-label">
                  <Lock size={12} />
                  NOC Password
                </label>
                <div className="gate-input-wrap">
                  <input
                    ref={inputRef}
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter password"
                    className={`gate-input ${error ? "gate-input-error" : ""}`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="gate-eye-btn"
                    tabIndex={-1}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <p className="gate-error">
                    <AlertTriangle size={12} />
                    {error}
                  </p>
                )}
              </div>

              <button type="submit" className="gate-submit-btn" disabled={!password}>
                <ShieldCheck size={15} />
                Unlock Dashboard
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="gate-footer-note">
            <span className="gate-dot" />
            Fentons IT — NOC Security Portal
          </div>
        </div>
      </div>
    </div>
  );
}
