<<<<<<< HEAD
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
=======
import Link from "next/link";
import "../../styles/login.css";
>>>>>>> deli

export default function LoginPage() {
  const router = useRouter();
  const [ _, setCookie ] = useCookies();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignInFormData>();
  
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
    setCookie("email", data.email);
    router.push('/account');
  }
  setLoading(false);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="top-bar">
<Link href="/">
  <div className="logo">LiveLink Events</div>
</Link>        

</div>

        <div className="login-title">LOG IN</div>
        <div className="required-note">* Indicates required field</div>

        <div className="input-group">
<<<<<<< HEAD
          <div className="input-label">Email*</div>
          <input type="text" className="input-box" {...register("email", {required: true})}/>
        </div>

        <div className="input-group">
          <div className="input-label">Password*</div>
          <input type="password" className="input-box" {...register("password", {required: true})}/>
=======
          <label className="input-label" htmlFor="username">
            Username*
          </label>
          <input id="username" type="text" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password*
          </label>
          <input id="password" type="password" className="input-box" />
>>>>>>> deli
        </div>

        <div className="cta">
          <button className="cta-btn" disabled={ loading }>
            { loading ? 'Logging In...' : 'Log In' }
          </button>
        </div>

        <div className="footer-text">
          Or
          <br />
<<<<<<< HEAD
          <a href="/signup" className="footer-link">
            Sign Up
          </a>
=======
          <Link href="/signup">
            <span>Sign Up</span>
          </Link>{" "}
>>>>>>> deli
          to create an account
        </div>
      </form>
    </main>
  );
}