/* SIGN IN PAGE I ACCIDENTALLY MIXED THE NAMES */

import Layout from "../globalComponents/Layout";

export default function LoginPage() {
  return (
    
    <Layout>
      
      <div className="signin-title">SIGN IN</div>
      <div className="required-note">* Indicates required field</div>
<div className="signin-container">
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
</div>
      <div className="cta">
        <button className="cta-btn">
          Create Account
        </button>
      </div>

      <div className="footer-text">
        Already have an account?<br />
        <a href="signin">
         Log In
        </a>
      </div>
    </Layout>
  );
}