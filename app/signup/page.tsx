"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import "@/styles/signin.css";

type FormData = {
  accountType: "customer" | "organizer";
  email: string;
  password: string;
  confirmPassword: string;

  // organizer
  fullName?: string;
  phoneNumber?: string;
  companyName?: string;

  // customer
  firstName?: string;
  lastName?: string;
  dob?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [_, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      accountType: "customer",
    },
  });

  const accountType = watch("accountType");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        data.accountType === "organizer"
          ? "/api/account/organizer"
          : "/api/account/customer";

      const body =
        data.accountType === "organizer"
          ? {
              email: data.email,
              password: data.password,
              fullName: data.fullName,
              phoneNumber: data.phoneNumber,
              companyName: data.companyName,
            }
          : {
              email: data.email,
              password: data.password,
              firstName: data.firstName,
              lastName: data.lastName,
              dob: data.dob,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Signup failed.");
        setLoading(false);
        return;
      }

      // set cookies
      setCookie("email", data.email, { path: "/" });
      setCookie("accountType", data.accountType, { path: "/" });

      // redirect
      router.push(`/account/${data.accountType}`);
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }

    setLoading(false);
  };

  return (
    <main className="login-page">
      <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-title">SIGN UP</div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* account type */}
        <select {...register("accountType")}>
          <option value="customer">Customer</option>
          <option value="organizer">Organizer</option>
        </select>

        <input placeholder="Email" {...register("email")} required />
        <input type="password" placeholder="Password" {...register("password")} required />
        <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} required />

        {/* organizer fields */}
        {accountType === "organizer" && (
          <>
            <input placeholder="Full Name" {...register("fullName")} required />
            <input placeholder="Phone Number" {...register("phoneNumber")} required />
            <input placeholder="Company Name" {...register("companyName")} required />
          </>
        )}

        {/* customer fields */}
        {accountType === "customer" && (
          <>
            <input placeholder="First Name" {...register("firstName")} required />
            <input placeholder="Last Name" {...register("lastName")} required />
            <input type="date" {...register("dob")} required />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
    </main>
  );
}