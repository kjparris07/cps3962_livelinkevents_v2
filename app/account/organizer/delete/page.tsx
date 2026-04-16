'use client'

import Link from "next/link";
import "@/styles/main.css";
import "@/styles/signin.css";

import { deleteAccount } from "@/app/actions";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteOrganizer() {
  const router = useRouter();
  const [ cookies, , removeCookie ] = useCookies();
  const { handleSubmit } = useForm();
  const [ loading, setLoading ] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? cookies.email : null;

  const onSubmit = async () => {
    setLoading(true);
    const deletion = await deleteAccount(cookies.email, "organizer");
    if (deletion.success) {
      removeCookie("email");
      removeCookie("accountType");
      router.push("/");
    } else {
      console.error("Something went wrong...", deletion.error);
    }
    setLoading(false)
  }

  if (!isLoggedIn) return <h1 className="title">Please log in if you would like to delete your account.</h1>

  return (
    <main className="login-page">

      <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="login-title">DELETE ORGANIZER ACCOUNT</h1>

        <p className="required-note">
          This action cannot be undone.
        </p>

        <div className="cta">
          <button className="view-events-btn" disabled={loading}>{loading ? "Loading..." : "Confirm Deletion"}</button>
        </div>
      </form>
    </main>
  );
}