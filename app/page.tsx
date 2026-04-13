'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

import { searchArtists, searchStates, searchDates } from '@/app/actions';
import { Results } from './globalComponents/Results';

import "../styles/main.css";

type ArtistFormData = { artist: string };
type StateFormData = { state: string };
type DateFormData = { date: string };

export default function Home() {
  const { register, handleSubmit } = useForm<any>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (type: string, data: any) => {
    setLoading(true);
    setHasSearched(true);

    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    let events = [];

    if (type === "artist") events = await searchArtists(fd);
    if (type === "state") events = await searchStates(fd);
    if (type === "date") events = await searchDates(fd);

    setResults(events);
    setLoading(false);
  };

  return (
    <main>
      <div className="top-bar">
        <Link href="/" className="logo">LiveLink Events</Link>

        <Link href="/login" className="avatar-hover">
          <span className="avatar-circle">👤</span>
          <span className="avatar-label">Sign Up / Log In</span>
        </Link>
      </div>

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
          <select {...register("state")} className="input-box">
            <option value="">Select a state</option>
            <option value="NJ">New Jersey</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
          </select>
          <button className="babyButton">{loading ? "..." : ">"}</button>
        </form>

        <form onSubmit={handleSubmit((d) => handleSearch("date", d))} className="search-card">
          <label className="field-label">Date</label>
          <input type="date" {...register("date")} className="input-box" />
          <button className="babyButton">{loading ? "..." : ">"}</button>
        </form>

        <form onSubmit={handleSubmit((d) => handleSearch("artist", d))} className="search-card">
          <label className="field-label">Artist</label>
          <input {...register("artist")} className="input-box" placeholder="Artist" />
          <button className="babyButton">{loading ? "..." : ">"}</button>
        </form>
      </div>
      </div>

      {hasSearched && (
        <div id="results">
          <Results results={results} />
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