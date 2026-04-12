import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/login.css";

export default function DeleteCustomer() {
  return (
    <main className="login-page">
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>
      </div>

      <div className="login-container">
        <h1 className="login-title">DELETE ACCOUNT</h1>

        <p className="required-note">
          This action cannot be undone.
        </p>

        <div className="cta">
          <Link href="/login" className="view-events-btn">
            Confirm Delete
          </Link>
        </div>
      </div>
    </main>
  );
}