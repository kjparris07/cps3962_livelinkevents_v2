"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/signin.css";

export default function SignupPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const handleSubmit = () => {
    setError("");
    setSuccessMessage("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!usernameRegex.test(username)) {
      setError(
        "Username must be 3 to 15 characters and can only use letters, numbers, or underscores."
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include at least one number and one symbol."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const newUser = {
      accountType,
      fullName,
      email,
      username,
      password,
      phoneNumber: "",
      membershipPlan:
        accountType === "customer" ? "Basic Free Membership" : "Organizer Plan",
      favoriteGenre: "",
      favoriteArtist: "",
      favoriteCity: "",
      profilePrivate: false,
      marketingEmails: true,
      ticketAlerts: true,
      twoFactorEnabled: false,
    };

    localStorage.setItem("livelinkUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUsername", username);
    localStorage.setItem("loggedInEmail", email);
    localStorage.setItem("loggedInRole", accountType);

    setSuccessMessage("Account created successfully.");

    setTimeout(() => {
      if (accountType === "organizer") {
        router.push("/account/organizer");
      } else {
        router.push("/account/customer");
      }
    }, 1000);
  };

  return (
    <main className="signin-container">
        <div className="top-bar">
          <Link href="/" className="logo">
            LiveLink Events
          </Link>
        </div>

        <div className="signin-title">SIGN UP</div>
        <div className="required-note">* Indicates required field</div>

        <div className="input-group">
          <label className="input-label" htmlFor="accountType">
            Account Type*
          </label>
          <select
            id="accountType"
            className="input-box"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="fullName">
            {accountType === "organizer" ? "Organizer Name*" : "Full Name*"}
          </label>
          <input
            id="fullName"
            type="text"
            className="input-box"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
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
            placeholder="Enter your e-mail address"
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
            placeholder="Enter your username"
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
            placeholder="Type in your password"
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
            placeholder="Type again your password"
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}

        {successMessage && (
          <p style={{ color: "green", marginBottom: "15px" }}>
            {successMessage}
          </p>
        )}

        <div className="cta">
          <button type="button" className="cta-btn" onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        <div className="footer-text">
          Already have an account?
          <br />
          <Link href="/login">
            <span>Sign In</span>
          </Link>
        </div>
    </main>
  );
}