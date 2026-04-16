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
        const result = await deleteAccount(cookies.email, "customer");
        if (result.success) {
          removeCookie("email", {path: "/"});
          removeCookie("accountType", {path: "/"});
          router.push("/");
        } else {
          throw Error("Could not delete from database.");
        }
      } catch (error) {
        console.error(error);
        setMessage('Something went wrong deleting customer account.');
      } finally {
        setLoading(false);
      }
    }
    
  }

  return (
    <main className='container delete-container'>
      <h1>Delete Customer Account</h1>
      <p>Are you sure you want to delete your customer account?</p>
      <button className='account-primary-btn' onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Account'}
      </button>
      {message && <p>{message}</p>}
    </main>
  );
}