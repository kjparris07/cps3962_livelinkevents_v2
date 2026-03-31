/* PAYMENT PAGE */

import Layout from "../globalComponents/Layout";

export default function PaymentPage() {
  return (
    <main>
      <div className="payment-title">PAYMENT</div>
      <div className="required-note">* Indicates required field</div>
      <div className="signin-container">
        <div className="input-group">
          <div className="input-label">Name on Card*</div>
          <input type="text" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Digits*</div>
          <input type="email" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Expiration date*</div>
          <input type="password" className="input-box" />
        </div>

        <div className="input-group">
          <div className="input-label">Security code*</div>
          <input type="password" className="input-box" />
        </div>
      </div>
      <div className="cta">
        <button className="cta-btn">
          Continue
        </button>
      </div>
    </main>
      
  );
}