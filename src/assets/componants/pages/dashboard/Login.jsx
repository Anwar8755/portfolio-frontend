import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../../../services/api";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginAdmin(formData.username, formData.password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/admin-dashboard");
      } else {
        setError("Login failed. Invalid credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-grid" aria-hidden="true" />

      <div className="login-brand">
        <span className="login-brand__dot" />
        Portfolio<span className="login-brand__accent">Admin</span>
      </div>

      <div className="terminal-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-filename">login.sh</span>
          <span className="terminal-lang">bash</span>
        </div>

        <div className="terminal-body">
          <p className="terminal-eyebrow">// authentication</p>
          <h2 className="terminal-title">Admin Login</h2>
          <p className="terminal-subtitle">Sign in to manage the platform</p>

          <form onSubmit={handleSubmit} className="terminal-form" noValidate>
            <div
              className={`terminal-error ${error ? "terminal-error--visible" : ""}`}
              role="alert"
            >
              {error && <span>✗ {error}</span>}
            </div>

            <div className="terminal-field">
              <label className="terminal-label" htmlFor="username">
                <span className="terminal-prompt">$</span> login --user
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="admin"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="terminal-field">
              <label className="terminal-label" htmlFor="password">
                <span className="terminal-prompt">$</span> login --pass
              </label>
              <div className="terminal-password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="terminal-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path
                        d="M10.6 5.1A10.9 10.9 0 0 1 12 5c5 0 9 4.5 10 7-.6 1.3-1.6 2.8-3 4.1M7.5 6.8C4.8 8.1 2.9 10.4 2 12c1.3 2.6 4.4 7 10 7 1.2 0 2.3-.2 3.3-.6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path d="M9.9 9.9a2.5 2.5 0 0 0 3.6 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 12c1.3-2.6 4.4-7 10-7s8.7 4.4 10 7c-1.3 2.6-4.4 7-10 7s-8.7-4.4-10-7Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="terminal-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="terminal-submit__loading">
                  Authenticating<span className="terminal-cursor">_</span>
                </span>
              ) : (
                <>
                  Sign in
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="terminal-statusbar">
          <span className="terminal-statusbar__item">
            <span className="status-pulse" /> Encrypted session
          </span>
          <span className="terminal-statusbar__item terminal-statusbar__branch">main</span>
        </div>
      </div>
    </div>
  );
}