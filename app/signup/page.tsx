"use client";

import Link from "next/link";
import { useState } from "react";
import "../../styles/login.css";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = () => {
    setError("");
    setSuccessMessage("");

    if (fullName.trim() === "") {
      setError("Full name is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!usernameRegex.test(username)) {
      setError("Username must be 3 to 15 characters and can only use letters, numbers, or underscores.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include at least one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccessMessage("Account created successfully.");
    setFullName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="top-bar">
          <Link href="/" className="logo">
            LiveLink Events
          </Link>
        </div>

        <div className="login-title">SIGN UP</div>
        <div className="required-note">* Indicates required field</div>

        <div className="input-group">
          <label className="input-label" htmlFor="fullname">
            Full Name*
          </label>
          <input
            id="fullname"
            type="text"
            className="input-box"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Email*
          </label>
          <input
            id="email"
            type="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="username">
            Username*
          </label>
          <input
            id="username"
            type="text"
            className="input-box"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password*
          </label>
          <input
            id="password"
            type="password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="confirmPassword">
            Confirm Password*
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input-box"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {successMessage && (
          <p style={{ color: "green", marginBottom: "15px" }}>
            {successMessage}
          </p>
        )}

        <div className="cta">
          <button className="cta-btn" onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        <div className="footer-text">
          Already have an account?
          <br />
          <Link href="/login">
            <span>Log In</span>
          </Link>
        </div>
      </div>
    </main>
  );
}