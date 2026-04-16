'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

import "@/styles/signin.css";

type SignInFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [_, setCookie] = useCookies(['email']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Server did not return JSON. Check /api/login route.");
      }

      if (result.success) {
        setCookie("email", data.email, { path: "/" });

        if (result.account_type === "customer") {
          router.push("/account/customer");
        } else {
          router.push("/account/organizer");
        }
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-title">LOG IN</div>
        <div className="required-note">* Indicates required field</div>

        <div className="input-group">
          <div className="input-label">Email*</div>
          <input
            type="text"
            className="input-box"
            {...register("email", { required: true })}
          />
        </div>

        <div className="input-group">
          <div className="input-label">Password*</div>
          <input
            type="password"
            className="input-box"
            {...register("password", { required: true })}
          />
        </div>

        <div className="cta">
          <button type="submit" className="cta-btn" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </div>

        {error && <div className="required-note">{error}</div>}

        <div className="footer-text">
          Or
          <br />
          <a href="/signup" className="footer-link">
            Sign Up
          </a>{" "}
          to create an account
        </div>
      </form>
    </main>
  );
}