import "../../styles/signup.css";

export default function SignUpPage() {
  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="top-bar">
          <a href="/" className="logo">
            LiveLink Events
          </a>
        </div>

        <div className="signup-title">SIGN UP</div>
        <div className="required-note">* Indicates required field</div>

        <div className="input-group">
          <div className="input-label">Username*</div>
          <input type="text" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Email Address*</div>
          <input type="email" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Create Password*</div>
          <input type="password" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Confirm Password*</div>
          <input type="password" className="input-box" />
        </div>

        <div className="cta">
          <button className="cta-btn">Create Account</button>
        </div>

        <div className="footer-text">
          Already have an account?
          <br />
          <a href="/login" className="footer-link">
            Log In
          </a>
        </div>
      </div>
    </main>
  );
}