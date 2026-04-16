"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

import "../../../../styles/main.css";
import "../../../../styles/signin.css";

export default function EditOrganizer() {
  const router = useRouter();
  const [cookies] = useCookies(["email"]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organizationType, setOrganizationType] = useState("Artist / Organizer");
  const [website, setWebsite] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [artistGenre, setArtistGenre] = useState("");
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          setFullName(result.user.fullName || "");
          setEmail(result.user.email || "");
          setUsername(result.user.username || "");
          setPhoneNumber(result.user.phoneNumber || "");
          setOrganizationType(result.user.organizationType || "Artist / Organizer");
          setWebsite(result.user.website || "");
          setInstagramHandle(result.user.instagramHandle || "");
          setArtistGenre(result.user.artistGenre || "");
          setMarketingEmails(
            result.user.marketingEmails !== undefined
              ? result.user.marketingEmails
              : true
          );
          setTwoFactorEnabled(
            result.user.twoFactorEnabled !== undefined
              ? result.user.twoFactorEnabled
              : false
          );
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

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/account/organizer/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cookies.email,
          fullName,
          username,
          phoneNumber,
          organizationType,
          website,
          instagramHandle,
          artistGenre,
          marketingEmails,
          twoFactorEnabled,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Organizer profile updated successfully.");

        setTimeout(() => {
          router.push("/account/organizer");
        }, 1000);
      } else {
        setMessage(result.message || "Update failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong updating organizer profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="signin-page">Loading...</main>;
  }

  return (
    <main className="signin-page">
      <div className="top-bar">
        <Link href="/" className="logo">
          LiveLink Events
        </Link>
      </div>

      <div className="signin-container">
        <h1 className="signin-title">EDIT ORGANIZER PROFILE</h1>
        <p className="required-note">
          Update your organizer information, artist profile, and contact details
        </p>

        <div className="input-group">
          <label className="input-label" htmlFor="fullName">
            Organizer / Artist Name
          </label>
          <input
            id="fullName"
            className="input-box"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Business Email
          </label>
          <input
            id="email"
            className="input-box"
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input-box"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phoneNumber">
            Business Phone Number
          </label>
          <input
            id="phoneNumber"
            className="input-box"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="organizationType">
            Organizer Type
          </label>
          <select
            id="organizationType"
            className="input-box"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
          >
            <option value="Artist / Organizer">Artist / Organizer</option>
            <option value="Event Company">Event Company</option>
            <option value="Venue Partner">Venue Partner</option>
            <option value="Promoter">Promoter</option>
            <option value="Management Team">Management Team</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            className="input-box"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="instagramHandle">
            Instagram Handle
          </label>
          <input
            id="instagramHandle"
            className="input-box"
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="artistGenre">
            Primary Genre
          </label>
          <input
            id="artistGenre"
            className="input-box"
            type="text"
            value={artistGenre}
            onChange={(e) => setArtistGenre(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              style={{ marginRight: "10px" }}
            />
            Receive LiveLink organizer emails
          </label>
        </div>

        <div className="input-group">
          <label className="input-label">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              style={{ marginRight: "10px" }}
            />
            Enable two-factor authentication
          </label>
        </div>

        {message && (
          <p style={{ color: "green", marginBottom: "15px" }}>
            {message}
          </p>
        )}

        <div
          className="cta"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="cta-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="view-events-btn"
            onClick={() => router.push("/account/organizer")}
          >
            Back to Account
          </button>
        </div>
      </div>
    </main>
  );
}