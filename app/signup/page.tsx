'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { createAccount } from '../actions';

import "../../styles/signup.css";
import "../../styles/main.css";

type SignUpFormData = {
  // shared fields
  email: string;
  account_type: 'customer' | 'organizer';
  password: string;
  // Customer ONLY fields
  fName?: string;
  lName?: string;
  dob?: string;
  // Organizer ONLY fields
  name?: string;
  phone?: string;
  company?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [ _, setCookie ] = useCookies();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm<SignUpFormData>({
    defaultValues: {
      account_type: 'customer'
    }
  });

  const accountType = watch('account_type');

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, value.toString());
      }
    });

    const result = await createAccount(fd);
    if (result.success) {
      setCookie("email", fd.get('email'));
      router.push('/account');
    } else {
      console.log(result.error);
    }
    setLoading(false);
  };

  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="top-bar">
          <a href="/" className="logo">
            LiveLink Events
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
          <div className='sign-up-title'>SIGN UP</div>

          {/* Shared Fields */}
          <div>
            <select className="input-box" {...register("account_type")}>
              <option value="customer">Customer</option>
              <option value="organizer">Organizer</option>
            </select>
            <input className="input-box" {...register("email", { required: true })} placeholder="Email" type="email" />
            <input className="input-box" {...register("password", { required: true })} placeholder="Password" type="password" />
          </div>

          {/* Conditional Fields for CUSTOMER */}
          {accountType === 'customer' && (
            <div className="dynamic-fields">
              <input className="input-box" {...register("fName", { required: true })} placeholder="First Name" />
              <input className="input-box" {...register("lName", { required: true })} placeholder="Last Name" />
              <label>Date of Birth:</label>
              <input className="input-box" {...register("dob", { required: true })} type="date" />
            </div>
          )}

          {/* Conditional Fields for ORGANIZER */}
          {accountType === 'organizer' && (
            <div className="dynamic-fields">
              <input className="input-box" {...register("name", { required: true })} placeholder="Full Name" />
              <input className="input-box" {...register("phone", { required: true })} placeholder="Phone (1234567890)" maxLength={10} />
              <input className="input-box" {...register("company", { required: true })} placeholder="Organization/Company Name" />
            </div>
          )}

          <button type="submit" className="ctn-btn">
            { loading ? "Loading..." : "Sign Up as " + accountType.toUpperCase() }
          </button>
        </form>

        <div className="footer-text">
          Already have an account?
          <br />
          <a href="/login" className="footer-link">
            Log In
          </a>
        </div>
      </div>
    </main>
  );
}