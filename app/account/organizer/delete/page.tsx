'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/app/actions';

import "@/styles/main.css";
import "@/styles/account.css";

export default function DeleteOrganizerPage() {
  const [cookies, , removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setMessage('');

    if (cookies.email) {
      try {
        const result = await deleteAccount(cookies.email, "organizer");

        if (result.success) {
          removeCookie("email", { path: "/" });
          removeCookie("accountType", { path: "/" });
          router.push("/");
        } else {
          throw Error();
        }
      } catch {
        setMessage('Something went wrong deleting organizer account.');
      } finally {
        setLoading(false);
      }
    }
  }

  const handleReset = () => {
    router.push("/account/organizer/edit");
  };

  return (
    <main className='account-page'>
      <div className='account-box delete-container'>
        <h1>Delete Organizer Account</h1>
        <p>Are you sure you want to delete your organizer account?</p>

        <div className="account-actions">
          <button
            className="account-secondary-btn"
            onClick={() => router.push("/account/organizer")}
          >
            No, Go Back
          </button>

          <button
            className="account-warning-btn"
            onClick={handleReset}
          >
            Reset Settings
          </button>

          <button
            className="account-danger-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}