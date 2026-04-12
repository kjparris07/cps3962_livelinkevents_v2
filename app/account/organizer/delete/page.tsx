import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/login.css";

export default function DeleteOrganizer() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">DELETE ORGANIZER ACCOUNT</h1>

        <p className="required-note">
          This action cannot be undone.
        </p>

        <div className="input-group">
          <label className="input-label">
            Enter your username to confirm
          </label>
          <input className="input-box" placeholder="Enter username" />
        </div>

        <div className="cta">
          <Link href="/login" className="view-events-btn">
            Confirm Delete
          </Link>
        </div>
      </div>
    </main>
  );
}