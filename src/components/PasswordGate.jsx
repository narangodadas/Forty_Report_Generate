/**
 * PasswordGate.jsx
 *
 * Shows when current time is outside 16:00–20:00 (4 PM – 8 PM).
 * Requires password Kiyanne_Naa to proceed.
 * Shows live countdown to next open window.
 */

import { useState, useEffect, useRef } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";

const CORRECT_PASSWORD = "Kiyanne_Naa";

/**
 * Returns { allowed, nextOpenMs }
 *
 * allowed    — true if 16:00 ≤ now < 20:00
 * nextOpenMs — ms until the next 16:00 window opens
 */
function getAccessState() {
  const now = new Date();

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const totalMinutes = h * 60 + m;

  const allowed =
    totalMinutes >= 16 * 60 &&
    totalMinutes < 20 * 60;

  // Calculate milliseconds until next 16:00
  let nextOpen;

  if (totalMinutes < 16 * 60) {
    // Same day 16:00
    const secsTill =
      (16 * 60 - totalMinutes) * 60 - s;

    nextOpen = secsTill * 1000;
  } else {
    // Tomorrow 16:00
    const secsTillMidnight =
      (24 * 60 - totalMinutes) * 60 - s;

    const secsTill4pm =
      16 * 60 * 60;

    nextOpen =
      (secsTillMidnight + secsTill4pm) * 1000;
  }

  return {
    allowed,
    nextOpenMs: nextOpen,
  };
}

/**
 * Format milliseconds as HH:MM:SS
 */
function formatCountdown(ms) {
  if (ms <= 0) {
    return "00:00:00";
  }

  const totalSec = Math.floor(ms / 1000);

  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor(
    (totalSec % 3600) / 60
  );
  const ss = totalSec % 60;

  return [hh, mm, ss]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [allowed, setAllowed] = useState(
    () => getAccessState().allowed
  );

  const inputRef = useRef(null);

  /**
   * Live countdown
   */
  useEffect(() => {
    const tick = () => {
      const {
        nextOpenMs,
        allowed: currentAllowed,
      } = getAccessState();

      setCountdown(nextOpenMs);
      setAllowed(currentAllowed);
    };

    // Run immediately
    tick();

    // Update every second
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  /**
   * Focus password input on mount
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Handle password submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      allowed: nowAllowed,
    } = getAccessState();

    /**
     * Correct password:
     * Allow access at any time.
     */
    if (password === CORRECT_PASSWORD) {
      setError("");
      setSuccess(true);

      setTimeout(() => {
        onUnlock();
      }, 900);

      return;
    }

    /**
     * No password:
     * Allow access only between
     * 4:00 PM and 8:00 PM.
     */
    if (!password) {
      if (nowAllowed) {
        setError("");
        setSuccess(true);

        setTimeout(() => {
          onUnlock();
        }, 900);

        return;
      }

      setError(
        "System unavailable outside 4:00 PM–8:00 PM."
      );

      setShaking(true);

      setTimeout(() => {
        setShaking(false);
      }, 500);

      return;
    }

    /**
     * Incorrect password
     */
    setError(
      "Incorrect password. Please try again."
    );

    setShaking(true);
    setPassword("");

    setTimeout(() => {
      setShaking(false);
    }, 500);

    inputRef.current?.focus();
  };

  return (
    <div
      className="gate-page"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        overflow: "auto",

        boxSizing: "border-box",

        zIndex: 9999,
      }}
    >
      {/* =========================================
          Animated Background
          ========================================= */}
      <div className="gate-background">
        <div className="gate-bg-circle gate-bg-circle-1" />
        <div className="gate-bg-circle gate-bg-circle-2" />
        <div className="gate-bg-grid" />
      </div>

      {/* =========================================
          Centered Card Wrapper
          ========================================= */}
      <div
        className="gate-card-wrap"
        style={{
          width: "100%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          boxSizing: "border-box",

          padding: "20px",

          position: "relative",

          zIndex: 10,
        }}
      >
        {/* =========================================
            Password Card
            ========================================= */}
        <div
          className={`
            gate-card
            ${shaking ? "gate-shake" : ""}
            ${success ? "gate-success-anim" : ""}
          `}
          style={{
            width: "100%",
            maxWidth: "440px",

            margin: "0 auto",

            boxSizing: "border-box",
          }}
        >
          {/* =========================================
              Top Icon
              ========================================= */}
          <div className="gate-icon-ring">
            {success ? (
              <ShieldCheck
                size={28}
                className="gate-icon-success"
              />
            ) : (
              <Lock
                size={28}
                className="gate-icon-lock"
              />
            )}
          </div>

          {/* =========================================
              Heading
              ========================================= */}
          <h1 className="gate-title">
            {success
              ? "Access Granted"
              : "Restricted Access"}
          </h1>

          {/* =========================================
              Subtitle
              ========================================= */}
          <p className="gate-subtitle">
            {success
              ? "Redirecting to dashboard…"
              : "Enter the NOC password to continue, or access without a password between 4:00 PM – 8:00 PM."}
          </p>

          {/* =========================================
              Countdown Card
              ========================================= */}
          {!success && (
            <div className="gate-countdown-card">
              <div className="gate-countdown-header">
                <Clock size={13} />

                <span>
                  Next open window in
                </span>
              </div>

              <div className="gate-countdown-time">
                {formatCountdown(countdown)}
              </div>

              <div className="gate-countdown-sub">
                {allowed ? (
                  "Free access is available now"
                ) : (
                  <>
                    Free access resumes at{" "}
                    <strong>4:00 PM</strong> today
                  </>
                )}
              </div>
            </div>
          )}

          {/* =========================================
              Password Form
              ========================================= */}
          {!success && (
            <form
              onSubmit={handleSubmit}
              className="gate-form"
              noValidate
            >
              <div className="gate-field">
                {/* Password Label */}
                <label className="gate-label">
                  <Lock size={12} />

                  NOC Password
                </label>

                {/* Password Input */}
                <div className="gate-input-wrap">
                  <input
                    ref={inputRef}
                    type={
                      show
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(
                        e.target.value
                      );

                      setError("");
                    }}
                    placeholder="Enter password"
                    className={`
                      gate-input
                      ${
                        error
                          ? "gate-input-error"
                          : ""
                      }
                    `}
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShow(
                        (current) =>
                          !current
                      )
                    }
                    className="gate-eye-btn"
                    tabIndex={-1}
                  >
                    {show ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="gate-error">
                    <AlertTriangle size={12} />

                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="gate-submit-btn"
                disabled={
                  !password && !allowed
                }
              >
                <ShieldCheck size={15} />

                Unlock Dashboard
              </button>
            </form>
          )}

          {/* =========================================
              Footer
              ========================================= */}
          <div className="gate-footer-note">
            <span className="gate-dot" />

            Fentons IT — NOC Security Portal
          </div>
        </div>
      </div>
    </div>
  );
}