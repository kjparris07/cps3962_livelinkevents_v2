'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { searchArtists, searchStates, searchDates } from '@/app/actions';
import { Results } from './globalComponents/Results';

import "../styles/main.css";

type ArtistFormData = {
  artist: string;
};

type StateFormData = {
  state: string;
};

type DateFormData = {
  date: string;
};

export default function Home() {
  const { register, handleSubmit } = useForm<any>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const onArtistSubmit: SubmitHandler<ArtistFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("artist", data.artist);

    const events = await searchArtists(fd);
    setResults(events);
    setLoading(false);
  };

  const onStateSubmit: SubmitHandler<StateFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("state", data.state);

    const events = await searchStates(fd);
    setResults(events);
    setLoading(false);
  };

  const onDateSubmit: SubmitHandler<DateFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("date", data.date);

    const events = await searchDates(fd);
    setResults(events);
    setLoading(false);
  };

  return (
    <main>
      {/* ✅ YOUR HEADER */}
      <div className="top-bar">
        <Link href="/" className="logo">
          LiveLink Events
        </Link>

        <Link href="/login" className="avatar-hover">
          <span className="avatar-circle">👤</span>
          <span className="avatar-label">Sign Up / Log In</span>
        </Link>
      </div>

      {/* ✅ YOUR HERO TEXT */}
      <h1 id="tagline">
        YOUR NEXT CONCERT EXPERIENCE
        <br />
        STARTS HERE...
      </h1>

      <h2 id="search">Search by:</h2>

      {/* ✅ MERGED SEARCH (Deli logic + your UI layout) */}
      <div className="container">

        <form onSubmit={handleSubmit(onStateSubmit)} className="search-card">
          <label><h3>Location</h3></label>
          <select {...register("state")} className="input-box">
            <option value="">Select a state</option>
            <option value="NJ">New Jersey</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
          </select>
          <button className="babyButton" type="submit">
            {loading ? "..." : ">"}
          </button>
        </form>

        <form onSubmit={handleSubmit(onDateSubmit)} className="search-card">
          <label><h3>Date</h3></label>
          <input type="date" {...register("date")} className="input-box" />
          <button className="babyButton" type="submit">
            {loading ? "..." : ">"}
          </button>
        </form>

        <form onSubmit={handleSubmit(onArtistSubmit)} className="search-card">
          <label><h3>Artist</h3></label>
          <input
            type="text"
            placeholder="Artist"
            {...register("artist")}
            className="input-box"
          />
          <button className="babyButton" type="submit">
            {loading ? "..." : ">"}
          </button>
        </form>

      </div>

      {/* ✅ RESULTS FROM DELI */}
      <div id="results">
        <Results results={results} />
      </div>

      {/* ✅ YOUR BUTTONS */}
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