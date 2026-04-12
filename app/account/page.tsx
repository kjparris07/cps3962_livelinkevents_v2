import Link from "next/link";
import "../../../styles/main.css";
import "../../../styles/login.css";

export default function OrganizerAccount() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">ORGANIZER ACCOUNT</h1>

        <div className="input-group">
          <label className="input-label">Organizer Name</label>
          <input className="input-box" value="LiveLink Org" readOnly />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-box" value="organizer@email.com" readOnly />
        </div>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input className="input-box" value="organizer123" readOnly />
        </div>

        <div className="cta" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/account/organizer/edit" className="view-events-btn">
            Edit
          </Link>

          <Link href="/account/organizer/delete" className="view-events-btn">
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