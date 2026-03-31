/* LOG IN PAGE I ACCIDENTALLY MIXED THE NAMES */

import Layout from "../globalComponents/Layout";

export default function SigninPage() {
  return (
    
    <Layout>

    <div className="login-title">LOG IN</div>
    <div className="required-note">* Indicates required field</div>

    <div className="input-group">
        <div className="input-label">Username*</div>
        <input type="text" className="input-box" />
    </div>

    <div className="input-group">
        <div className="input-label">Password*</div>
        <input type="password" className="input-box" />
    </div>

    <div className="cta">
      <button className="cta-btn">
        Log In
      </button>
    </div>
    
    <div className="footer-text">
        Or<br></br>
        <a href="login">
         Sign In
        </a> to create an account
    </div>
    </Layout>
    )}