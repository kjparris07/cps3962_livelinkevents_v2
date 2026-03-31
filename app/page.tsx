"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [artist, setArtist] = useState("");

  const handleSearch = () => {
    if (!location && !date && !artist) {
      alert("No events entered, please try again.");
      return;
    }

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (artist) params.set("artist", artist);

    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="homepage">
      <div className="page">

        {/* Top bar */}
        <div className="top-bar">
          <a href="/" className="logo">
            LiveLink Events<span></span>
          </a>

          <a href="/login" className="auth-btn">
            <span className="auth-btn-icon"></span>
            Sign in/Log in
          </a>
        </div>

        {/* Main heading */}
        <div className="hero-text">
          YOUR NEXT CONCERT EXPERIENCE <br /> STARTS HERE...
        </div>

        {/* Search box */}
        <div className="search-box">
          <div className="search-title">Search by:</div>

          <div className="search-fields">

            <div className="field">
              <div className="field-label">Location</div>
              <input
                className="field-input"
                type="text"
                placeholder="Enter city or Zip Code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="field-label">Date</div>
              <input
                className="field-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="field-label">Artist</div>
              <input
                className="field-input"
                type="text"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Search button */}
        <div className="search">
          <button className="search button" onClick={handleSearch}>
            Search
          </button>

          <a href="/events">
            <button className="search button">
              See All Events
            </button>
          </a>
        </div>

        {/* CTA */}
        <div className="cta">
          <a href="/membership">
            <button className="cta-btn">
              Become a member today and don’t miss on discounts!
            </button>
          </a>
        </div>

      </div>
    </div>
  );
}