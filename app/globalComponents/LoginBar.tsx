'use client'

import { useCookies } from 'react-cookie';

export default function LoginBar() {
  const [ cookies, __, removeCookie ] = useCookies();

  const hasUsername = cookies.email;

  const submitLogout = async () => {
    try {
        removeCookie("email");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Logout failure." };
    }
  };

  return (
    <div className="top-bar">
      <span>
        <a href="/" className="logo">LiveLink Events</a>
      </span>
      <span>
        <button className="auth-btn">
          <a href={hasUsername ? "/account" : "/login"}>
            {hasUsername ? "Account" : "Sign Up / Log In"}
          </a>
        </button>
        {
          hasUsername ?
            <button className="auth-btn" onClick={submitLogout}>Logout</button>
          :
          <></>
        }
      </span>
    </div>
  );
}