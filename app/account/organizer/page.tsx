"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

import "../../../styles/main.css";
import "../../../styles/signin.css";
import "../../../styles/account.css";

type OrganizerData = {
  fullName?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  organizationType?: string;
  website?: string;
  instagramHandle?: string;
  artistGenre?: string;
  verifiedOrganizer?: boolean;
  eventsPublished?: number;
  monthlySales?: string;
  payoutMethod?: string;
  marketingEmails?: boolean;
  twoFactorEnabled?: boolean;
};

export default function OrganizerAccountPage() {
  const [cookies, , removeCookie] = useCookies(["email"]);
  const router = useRouter();

  const [organizer, setOrganizer] = useState<OrganizerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrganizerData() {
      try {
        const res = await fetch("/api/account/organizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: cookies.email }),
        });

        const result = await res.json();

        if (result.success) {
          setOrganizer({
            fullName: result.user.fullName || "",
            email: result.user.email || "",
            username: result.user.username || "",
            phoneNumber: result.user.phoneNumber || "Not added",
            organizationType: result.user.organizationType || "Artist / Organizer",
            website: result.user.website || "Not added",
            instagramHandle: result.user.instagramHandle || "Not added",
            artistGenre: result.user.artistGenre || "Not added",
            verifiedOrganizer:
              result.user.verifiedOrganizer !== undefined
                ? result.user.verifiedOrganizer
                : false,
            eventsPublished: result.user.eventsPublished || 0,
            monthlySales: result.user.monthlySales || "$0.00",
            payoutMethod: result.user.payoutMethod || "Not added",
            marketingEmails:
              result.user.marketingEmails !== undefined
                ? result.user.marketingEmails
                : true,
            twoFactorEnabled:
              result.user.twoFactorEnabled !== undefined
                ? result.user.twoFactorEnabled
                : false,
          });
        } else {
          setMessage(result.message || "Could not load organizer data.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong loading organizer data.");
      } finally {
        setLoading(false);
      }
    }

    if (cookies.email) {
      loadOrganizerData();
    } else {
      setMessage("No logged in organizer found.");
      setLoading(false);
    }
  }, [cookies.email]);

  const handleLogout = () => {
    removeCookie("email", { path: "/" });
    router.push("/login");
  };

  if (loading) {
    return <main className="account-page">Loading...</main>;
  }

  if (message) {
    return <main className="account-page">{message}</main>;
  }

  return (
    <main className="account-page">
      <div className="top-bar">
        <Link href="/" className="logo">
          LiveLink Events
        </Link>
      </div>

      <section className="account-wrapper">
        <div className="account-header">
          <p className="account-subheading">Organizer Dashboard</p>
          <h1 className="account-title-main">
            Welcome back{organizer?.username ? `, ${organizer.username}` : ""}!
          </h1>
          <p className="account-description">
            Manage your artist or company profile, event listings, media, sales,
            and organizer settings.
          </p>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <h2>Organizer Profile</h2>
            <p>
              <strong>Name:</strong> {organizer?.fullName || "Not added"}
            </p>
            <p>
              <strong>Email:</strong> {organizer?.email || "Not added"}
            </p>
            <p>
              <strong>Username:</strong> {organizer?.username || "Not added"}
            </p>
            <p>
              <strong>Business Phone:</strong> {organizer?.phoneNumber || "Not added"}
            </p>
            <p>
              <strong>Role Type:</strong>{" "}
              {organizer?.organizationType || "Artist / Organizer"}
            </p>

            <div className="account-card-actions">
              <Link href="/account/organizer/edit" className="account-primary-btn">
                Edit Organizer Profile
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Organizer Status</h2>
            <p>
              <strong>Verification:</strong>{" "}
              {organizer?.verifiedOrganizer ? "Verified" : "Pending Verification"}
            </p>
            <p>
              <strong>Payout Method:</strong> {organizer?.payoutMethod || "Not added"}
            </p>
            <p>
              <strong>Monthly Sales:</strong> {organizer?.monthlySales || "$0.00"}
            </p>

            <div className="account-card-actions">
              <button className="account-primary-btn" type="button">
                Update Payout Info
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Event Management</h2>
            <p>
              <strong>Published Events:</strong> {organizer?.eventsPublished || 0}
            </p>
            <p>
              Create, edit, and manage ticketed events listed through LiveLink.
            </p>

            <div className="account-card-actions stacked-actions">
              <button className="account-primary-btn" type="button">
                Create New Event
              </button>
              <button className="account-secondary-btn" type="button">
                Manage Events
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Artist / Brand Media</h2>
            <p>
              <strong>Website:</strong> {organizer?.website || "Not added"}
            </p>
            <p>
              <strong>Instagram:</strong> {organizer?.instagramHandle || "Not added"}
            </p>
            <p>
              <strong>Primary Genre:</strong> {organizer?.artistGenre || "Not added"}
            </p>

            <div className="account-card-actions stacked-actions">
              <button className="account-primary-btn" type="button">
                Upload Promo Media
              </button>
              <button className="account-secondary-btn" type="button">
                Edit Artist Info
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Sales & Audience Insights</h2>
            <p>
              <strong>Tickets Sold This Month:</strong> 128
            </p>
            <p>
              <strong>Top Performing City:</strong> Newark, NJ
            </p>
            <p>
              <strong>Most Interested Audience Genre:</strong> Pop / R&amp;B
            </p>

            <div className="account-card-actions">
              <button className="account-primary-btn" type="button">
                View Sales Details
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Account Actions</h2>
            <p>
              Manage account security, organizer settings, or remove your organizer
              profile.
            </p>

            <div className="account-card-actions stacked-actions">
              <Link href="/account/organizer/edit" className="account-primary-btn">
                Edit Account
              </Link>

              <Link
                href="/account/organizer/delete"
                className="account-secondary-btn"
              >
                Delete Organizer Account
              </Link>

              <button
                type="button"
                className="account-primary-btn"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}