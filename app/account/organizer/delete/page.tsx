'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import Link from "next/link";

import "../../../../styles/main.css";
import "../../../../styles/signin.css";

export default function DeleteOrganizer() {
  const [cookies, , removeCookie] = useCookies(['email']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/account/organizer/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cookies.email }),
      });

      const result = await res.json();

      if (result.success) {
        removeCookie('email', { path: '/' });
        router.push('/');
      } else {
        setMessage(result.message || 'Delete failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong deleting organizer account.');
    } finally {
      setLoading(false);
    }
  }

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

        <div className="cta">
          <button
            onClick={handleDelete}
            className="view-events-btn"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>

        {message && <p className="required-note">{message}</p>}
      </div>
    </main>
  );
}