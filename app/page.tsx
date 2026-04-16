'use client';

import { useState } from 'react';
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Results } from './globalComponents/Results';
import "../styles/main.css";

export default function Home() {
  const { register, handleSubmit } = useForm<any>();
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (type: string, data: any) => {
    setLoading(true);
    setHasSearched(true);

    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    const res = await Results(type, fd);
    setResults(res);

    setLoading(false);
  };

  return (
    <main>
      <h1 id="tagline">
        YOUR NEXT CONCERT EXPERIENCE
        <br />
        STARTS HERE...
      </h1>

      <div id="search">
        <h2 className="search-title">Search by:</h2>

        <div id="search-fields">

          <form onSubmit={handleSubmit((d) => handleSearch("state", d))} className="search-card">
            <label className="field-label">Location</label>
            <select {...register("state")} className="input-box" required>
              <option value="">Select a state</option>
              <option value="NJ">New Jersey</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
            </select>
            <button className="babyButton">{loading ? "..." : ">"}</button>
          </form>

          <form onSubmit={handleSubmit((d) => handleSearch("date", d))} className="search-card">
            <label className="field-label">Date</label>
            <input type="date" {...register("date")} className="input-box" required />
            <button className="babyButton">{loading ? "..." : ">"}</button>
          </form>

          <form onSubmit={handleSubmit((d) => handleSearch("artist", d))} className="search-card">
            <label className="field-label">Artist</label>
            <input {...register("artist")} className="input-box" placeholder="Artist" required />
            <button className="babyButton">{loading ? "..." : ">"}</button>
          </form>

        </div>
      </div>

      {hasSearched && (
        <div id="results">
          {results}
        </div>
      )}

      <div className="action-row">
        <Link href="/events" className="view-events-btn">
          View All Events
        </Link>

        <Link href="/membership" className="premium-box">
          Unlock Premium Access
        </Link>
      </div>
    </main>
  );
}