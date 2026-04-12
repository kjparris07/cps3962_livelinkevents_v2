import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/login.css";

export default function EditCustomer() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">EDIT ACCOUNT</h1>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input className="input-box" placeholder="Enter new username" />
        </div>

        <div className="cta">
          <Link href="/account/customer" className="view-events-btn">
            Save
          </Link>
        </div>
      </div>
    </main>
  );
}