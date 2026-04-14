'use client'

import { useCookies } from 'react-cookie';
import '@/styles/main.css';
import "@/styles/account.css";

export default function Home() {
  const [ cookies ] = useCookies();

  if (cookies.email) {
    const email = cookies.email;
    const atSign = email.indexOf('@');
    const name = email.substring(0, atSign);
    return (
      <main>
        <div className="container">
          <h1 className="title">ACCOUNT</h1>
          <p>Hello, {name}!</p>
        </div>
      </main>
    );
  } else {
    return (
      <h3>Please <a href="/login">login</a> to access your account.</h3>
    );
  }
}