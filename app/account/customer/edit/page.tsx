'use client';

import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/app/actions';

import "@/styles/main.css";
import "@/styles/account.css";

export default function DeleteCustomerPage() {
  const [cookies, , removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setMessage('');

    if (cookies.email) {
      try {
        const result = await deleteAccount(cookies.email, "customer"); // ✅ FIXED

        if (result.success) {
          removeCookie("email", { path: "/" });
          removeCookie("accountType", { path: "/" });
          router.push("/");
        } else {
          throw Error();
        }
      } catch {
        setMessage('Something went wrong deleting customer account.');
      } finally {
        setLoading(false);
      }
    }
  }

  const handleReset = () => {
    router.push("/account/customer/edit"); // if you have one
  };

  return (
    <main className='account-page'>
      <div className='account-box delete-container'>
        <h1>Delete Customer Account</h1>
        <p>Are you sure you want to delete your account?</p>

        <div className="account-actions">
          <button
            className="account-secondary-btn"
            onClick={() => router.push("/account/customer")}
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