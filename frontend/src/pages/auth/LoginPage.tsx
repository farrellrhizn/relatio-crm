import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Integrate with backend API POST /api/auth/login
      // Simulate login for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On success, navigate to dashboard
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background grid pattern */}
      <div className="login-page__grid" />

      {/* Subtle radial glow */}
      <div className="login-page__glow" />

      <div className="login-page__container">
        {/* Left side — Branding */}
        <div className="login-page__branding">
          <div className="login-page__branding-content">
            {/* Logo */}
            <div className="login-page__logo">
              <div className="login-page__logo-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
              <span className="login-page__logo-text">Relatio</span>
            </div>

            <h1 className="login-page__branding-title">
              Build lasting
              <br />
              <span className="login-page__branding-highlight">
                relationships
              </span>
            </h1>

            <p className="login-page__branding-desc">
              A modern CRM platform for managing leads, customers, and business
              growth — all in one place.
            </p>

            {/* Feature pills */}
            <div className="login-page__features">
              {["Lead Tracking", "Customer Insights", "Activity Logs", "Pipeline Analytics"].map(
                (feature) => (
                  <span key={feature} className="login-page__feature-pill">
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Footer credit */}
          <p className="login-page__branding-footer">
            © 2026 Relatio. Built for modern teams.
          </p>
        </div>

        {/* Right side — Login Form */}
        <div className="login-page__form-section">
          <div className="login-page__form-wrapper">
            {/* Mobile logo */}
            <div className="login-page__mobile-logo">
              <div className="login-page__logo-icon login-page__logo-icon--sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
              <span className="login-page__logo-text">Relatio</span>
            </div>

            <div className="login-page__form-header">
              <h2 className="login-page__form-title">Welcome back</h2>
              <p className="login-page__form-subtitle">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="login-page__error" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-page__form">
              {/* Email field */}
              <div className="login-page__field">
                <label htmlFor="login-email" className="login-page__label">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="login-page__input focus-ring"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Password field */}
              <div className="login-page__field">
                <div className="login-page__label-row">
                  <label htmlFor="login-password" className="login-page__label">
                    Password
                  </label>
                  <button
                    type="button"
                    className="login-page__forgot-link"
                    tabIndex={-1}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="login-page__password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="login-page__input login-page__input--password focus-ring"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-page__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="login-page__password-icon" />
                    ) : (
                      <Eye className="login-page__password-icon" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                id="login-submit"
                type="submit"
                className="login-page__submit focus-ring"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="login-page__spinner" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="login-page__submit-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-page__divider">
              <span className="login-page__divider-line" />
              <span className="login-page__divider-text">or</span>
              <span className="login-page__divider-line" />
            </div>

            {/* Register prompt */}
            <p className="login-page__register-prompt">
              Don't have an account?{" "}
              <button type="button" className="login-page__register-link">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}