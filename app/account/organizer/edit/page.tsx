import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/login.css";

export default function EditOrganizer() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">EDIT ORGANIZER ACCOUNT</h1>

        <div className="input-group">
          <label className="input-label">Organizer Name</label>
          <input className="input-box" placeholder="Enter organizer name" />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-box" placeholder="Enter email" />
        </div>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input className="input-box" placeholder="Enter username" />
        </div>

        <div className="input-group">
          <label className="input-label">New Password</label>
          <input className="input-box" type="password" placeholder="Enter new password" />
        </div>

        <div className="cta">
          <Link href="/account/organizer" className="view-events-btn">
            Save Changes
          </Link>
        </div>
      </div>
    </main>
  );
}