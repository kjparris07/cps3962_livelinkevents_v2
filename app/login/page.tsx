'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { logIn } from '../actions';

import "@/styles/signin.css";

type SignInFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [ _, setCookie ] = useCookies();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignInFormData>();
  const [error, setError] = useState("");
  
  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, value.toString());
      }
    });

    const result = await logIn(fd);
    if (result.success) {
      setCookie("email", data.email, { path: "/"});
      setCookie("accountType", result.account_type, { path: "/"});
      router.push(`/account/${result.account_type}`);
    } else {
      setError(`${result.error}`);
    }
    setLoading(false);
  };

  return (
    <main className="login-page">
      <form className="login-container" onSubmit={handleSubmit(onSubmit)}>

        <div className="login-title">LOG IN</div>
        <div className="required-note">* Indicates required field</div>

        {error && (
            <p id="input-error" style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}

        <div className="input-group">
          <div className="input-label">Email*</div>
          <input type="text" className="input-box" {...register("email", {required: true})}/>
        </div>

        <div className="input-group">
          <div className="input-label">Password*</div>
          <input type="password" className="input-box" {...register("password", {required: true})}/>
        </div>

        <div className="cta">
          <button className="cta-btn" disabled={ loading }>
            { loading ? 'Logging In...' : 'Log In' }
          </button>
        </div>

        <div className="footer-text">
          Or
          <br />
          <a href="/signup" className="footer-link">
            Sign Up
          </a>
          to create an account
        </div>
      </form>
    </main>
  );
}