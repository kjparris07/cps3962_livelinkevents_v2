"use client"
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

export default function LoginBar() {
  const [cookies, , removeCookie] = useCookies();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? cookies.email : null;

  const submitLogout = () => {
    removeCookie("email");
  };

  return (
    <div className="top-bar">
      <Link href="/" className="logo">
        LiveLink Events
      </Link>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Link
          href={isLoggedIn ? "/account/customer" : "/login"}
          className="avatar-hover"
        >
          <span className="avatar-circle">👤</span>
          <span className="avatar-label">
            {isLoggedIn ? "Account" : "Sign Up / Sign In"}
          </span>
        </Link>
        {isLoggedIn && (
          <button type="button" className="auth-btn avatar-hover logout" onClick={submitLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}