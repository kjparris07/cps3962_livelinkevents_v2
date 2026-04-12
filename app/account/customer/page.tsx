import Link from "next/link";
import "../../../styles/main.css";
import "../../../styles/login.css";

export default function CustomerAccount() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">CUSTOMER ACCOUNT</h1>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input className="input-box" value="user123" readOnly />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-box" value="user@email.com" readOnly />
        </div>

        <div className="cta">
          <Link href="/account/customer/edit" className="view-events-btn">
            Edit
          </Link>

          <Link href="/account/customer/delete" className="view-events-btn">
            Delete
          </Link>

          <Link href="/login" className="view-events-btn">
            Logout
          </Link>
        </div>
      </div>
    </main>
  );
}