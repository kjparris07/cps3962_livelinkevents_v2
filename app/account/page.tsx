"use client";

import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/main.css";
import "@/styles/account.css";

export default function AccountPage() {
  const [cookies] = useCookies(["email", "accountType"]);
  const router = useRouter();

  useEffect(() => {
    if (cookies.email && cookies.accountType) {
      router.push(`/account/${cookies.accountType}`);
    }
  }, [cookies.email, cookies.accountType, router]);

  if (!cookies.email) {
    return (
      <main>
        <h3>
          Please <Link href="/login">login</Link> to access your account.
        </h3>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <h1 className="title">Redirecting...</h1>
      </div>
    </main>
  );
}