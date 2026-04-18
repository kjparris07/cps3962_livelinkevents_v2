"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import EditForm from "./EditForm";
import "@/styles/main.css";
import "@/styles/signin.css";

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

export default function EditOrganizerPage() {
  const [cookies] = useCookies(["email"]);
  const [organizer, setOrganizer] = useState<OrganizerData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!cookies.email) {
      setMessage("Please login first.");
      return;
    }

    const fetchOrganizer = async () => {
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
          setMessage(data.message || "Could not load organizer info.");
          return;
        }

        setOrganizer(data.user);
      } catch (error) {
        console.error(error);
        setMessage("Server error loading organizer info.");
      }
    };

    fetchOrganizer();
  }, [cookies.email]);

  if (message) return <div>{message}</div>;
  if (!organizer) return <div>Loading...</div>;

  return <EditForm organizer={organizer} />;
}