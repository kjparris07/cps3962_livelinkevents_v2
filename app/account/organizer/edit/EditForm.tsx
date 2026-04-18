"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ organizer }: { organizer: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: organizer.fullName || "",
    companyName: organizer.companyName || "",
    organizationType: organizer.organizationType || "",
    phoneNumber: organizer.phoneNumber || "",
    artistGenre: organizer.artistGenre || "",
    website: organizer.website || "",
    instagramHandle: organizer.instagramHandle || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/account/organizer/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: organizer.email,
          ...formData,
        }),
      });

      const result = await res.json();

      if (result.success) {
        router.push("/account/organizer");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signin-page">
      <form onSubmit={handleSave} className="signin-container">
        <h1 className="signin-title">EDIT ACCOUNT</h1>
        <p className="required-note">
          Update your profile, contact details, preferences, and privacy settings
        </p>

        <div className="input-group">
          <label className="input-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="organizationType">
            Organizer Type
          </label>
          <select
            id="organizationType"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            className="input-box"
          >
            <option value="Artist / Organizer">Artist / Organizer</option>
            <option value="Event Company">Event Company</option>
            <option value="Venue Partner">Venue Partner</option>
            <option value="Promoter">Promoter</option>
            <option value="Management Team">Management Team</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="artistGenre">Genre</label>
          <input
            id="artistGenre"
            name="artistGenre"
            value={formData.artistGenre}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="instagramHandle">Instagram</label>
          <input
            id="instagramHandle"
            name="instagramHandle"
            value={formData.instagramHandle}
            onChange={handleChange}
            className="input-box"
            type="text"
          />
        </div>

        <button type="submit" className="account-primary-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}