"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { createAccount } from "@/app/actions";
import "@/styles/signin.css";
import "@/styles/main.css";

type SignUpFormData = {
  // shared fields
  email: string;
  account_type: 'customer' | 'organizer';
  password: string;
  confirmPassword: string;
  // Customer ONLY fields
  fName?: string;
  lName?: string;
  dob?: string;
  // Organizer ONLY fields
  name?: string;
  phone?: string;
  company?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [ _, setCookie ] = useCookies();
  const [loading, setLoading] = useState(false);
  const { register, watch, handleSubmit } = useForm<SignUpFormData>({
    defaultValues: {
      account_type: 'customer'
    }
  });
  const [error, setError ] = useState("");

  const accountType = watch('account_type');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const onSubmit = async (data: any) => {
    setError("");

    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(data.password)) {
      setError(
        "Password must be at least 6 characters and include at least one number and one symbol."
      );
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && key !== "confirmPassword") {
        fd.append(key, value.toString());
      }
    });

    const result = await createAccount(fd);
    if (result.success) {
      setCookie("email", fd.get('email'));
      if (accountType === "customer") {
        setCookie("accountType", "customer");
        router.push("/account/customer");
      } else {
        setCookie("accountType", "organizer");
        router.push("/account/organizer");
      }
    } else {
      console.error("Something went wrong...", result.error);
      setError(`Something went wrong...${result.error}`);
    }
    setLoading(false);

  };

  return (
    <main className="signup-page">
      <div className="signup-container container">

        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
          <div className='login-title'>SIGN UP</div>

          {/* Shared Fields */}
          <div className="input-group">
            <label className="input-label">Account Type:</label>
            <select className="input-box" {...register("account_type")}>
              <option value="customer">Customer</option>
              <option value="organizer">Organizer</option>
            </select>
            <label className="input-label">Email:</label>
            <input className="input-box" {...register("email", { required: true })} placeholder="Email" type="email" />
            
            <label className="input-label">Password:</label>
            <input className="input-box" {...register("password", { required: true })} placeholder="Password" type="password" />
            <input className="input-box" {...register("confirmPassword", { required: true })} placeholder="Confirm Password" type="password" />
          </div>

          {/* Conditional Fields for CUSTOMER */}
          {accountType === 'customer' && (
            <div className="dynamic-fields input-group">
              <label className="input-label">First Name:</label>
              <input className="input-box" {...register("fName", { required: true })} placeholder="First Name" />

              <label className="input-label">Last Name:</label>
              <input className="input-box" {...register("lName", { required: true })} placeholder="Last Name" />
              
              <label className="input-label">Date of Birth:</label>
              <input className="input-box" {...register("dob", { required: true })} type="date" />
            </div>
          )}

          {/* Conditional Fields for ORGANIZER */}
          {accountType === 'organizer' && (
            <div className="dynamic-fields input-group">
              <label className="input-label">Full Name:</label>
              <input className="input-box" {...register("name", { required: true })} placeholder="Full Name" />

              <label className="input-label">Phone Number (10 digits):</label>
              <input className="input-box" {...register("phone", { required: true })} placeholder="Phone (1234567890)" min={1000000000} maxLength={10} />
              
              <label className="input-label">Company Name:</label>
              <input className="input-box" {...register("company", { required: true })} placeholder="Organization/Company Name" />
            </div>
          )}

          {error && (
            <p id="input-error" style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <button type="submit" className="cta-btn">
            { loading ? "Loading..." : "Sign Up as " + accountType.toUpperCase() }
          </button>
        </form>

        <div className="footer-text">
          Already have an account? 
          <a href="/login" className="footer-link">
            {" "} Log In
          </a>
        </div>
      </div>
    </main>
  );
}