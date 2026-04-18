"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import "@/styles/main.css";
import "@/styles/account.css";

type OrganizerData = {
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  organizationType: string;
  website: string;
  instagramHandle: string;
  artistGenre: string;
  verifiedOrganizer: boolean;
  eventsPublished: number;
  monthlySales: string;
  payoutMethod: string;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
};

export default function OrganizerPage() {
  const [cookies] = useCookies(["email"]);
  const [organizer, setOrganizer] = useState<OrganizerData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!cookies.email) {
        setMessage("Please login to access your organizer account.");
        return;
      }

      try {
        const response = await fetch("/api/account/organizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: cookies.email }),
        });

        const data = await response.json();

        if (!data.success) {
          setMessage(data.message || "Could not load organizer account.");
          return;
        }

        setOrganizer(data.user);
      } catch (error) {
        console.error(error);
        setMessage("Server error loading organizer account.");
      }
    };

    fetchOrganizer();
  }, [cookies.email]);

  if (message) {
    return (
      <main className="account-page">
        <div className="account-box">
          <h1>Organizer Account</h1>
          <p>{message}</p>
        </div>
      </main>
    );
  }

  if (!organizer) {
    return (
      <main className="account-page">
        <div className="account-box">
          <h1>Organizer Account</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  const fields = [
    { label: "Full Name", value: organizer.fullName },
    { label: "Email", value: organizer.email },
    { label: "Username", value: organizer.username },
    { label: "Phone Number", value: organizer.phoneNumber },
    { label: "Organization Type", value: organizer.organizationType },
    { label: "Website", value: organizer.website },
    { label: "Instagram", value: organizer.instagramHandle },
    { label: "Genre", value: organizer.artistGenre },
    { label: "Verified Organizer", value: organizer.verifiedOrganizer ? "Yes" : "No" },
    { label: "Events Published", value: organizer.eventsPublished },
    { label: "Monthly Sales", value: organizer.monthlySales },
    { label: "Payout Method", value: organizer.payoutMethod },
    { label: "Marketing Emails", value: organizer.marketingEmails ? "Enabled" : "Disabled" },
    { label: "Two Factor Auth", value: organizer.twoFactorEnabled ? "Enabled" : "Disabled" },
  ];

  return (
    <main className="account-page">
      <div className="account-box">
        <h1>Organizer Account</h1>

        <div className="account-grid">
          {fields.map((field, index) => (
            <div key={index} className="account-row">
              <div className="account-cell label">{field.label}</div>
              <div className="account-cell value">{field.value}</div>
            </div>
          ))}
        </div>

        <div className="account-actions">
          <Link href="/account/organizer/edit" className="account-primary-btn">
            Edit Account
          </Link>

          <Link href="/account/organizer/create" className="account-primary-btn">
            Create Event
          </Link>

          <Link href="/account/organizer/delete" className="account-primary-btn">
            Delete Account
          </Link>
        </div>
      </div>
    </main>
  );
}