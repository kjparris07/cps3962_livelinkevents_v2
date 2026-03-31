/*  [ALL THIS WORKS FINE] */

import Layout from "../globalComponents/Layout";

export default function MembershipPage() {
  return (
    <Layout>

      {/* Membership heading */}
      <div className="hero-text" style={{ marginTop: "140px" }}>
        UPGRADE YOUR EXPERIENCE AND<br /> BECOME A MEMBER TODAY!
      </div>

      {/* White background box */}
      <div
        style={{
          background: "#ffffffcc",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "700px",
          margin: "40px auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "18px",
          lineHeight: "1.6",
          color: "#2d3436",
          marginTop: "60px",
        }}
      >
        <p><strong>Members enjoy:</strong></p>
        <ul style={{ marginTop: "10px" }}>
          <li>Higher-quality seats that offer closeness to the stage, a better view, and extra comfort.</li>
        <li>Early notifications.</li>
        <li>Enhanced alerts, including price drop.</li>
        <li>Exclusive deals on tickets and artist merchandise.</li>
        <li>Priority access to tickets for high-demand events. </li>
        <li>Exclusive access to members-only events, such as pre-sales, meet-and-greets, and special performances.</li>
        <li>Early access to tickets before general sale starts.</li>
        </ul>
      </div>

      {/* CTA button → redirects to payment */}
      <div className="cta">
        <a href="/payment">
          <button className="cta-btn">
            Become a Member Now
          </button>
        </a>
      </div>

    </Layout>
  );
}
