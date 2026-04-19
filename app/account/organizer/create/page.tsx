"use client";

import { useState } from "react";
import "@/styles/main.css";
import "@/styles/account.css";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    location: "",
    date: "",
    time: "",
    price: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Event Created:", formData);
    setMessage("Create Event button works.");
  };

  return (
    <main className="account-page">
      <div className="account-box">
        <h1>Create Event</h1>

        <form className="signin-container">
          <div className="input-group">
            <label className="input-label" htmlFor="title">Event Name</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-box"
              type="text"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="artist">Artist / Performer</label>
            <input
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="input-box"
              type="text"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-box"
              type="text"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-box"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="input-box"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="price">Ticket Price ($)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-box"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-box"
            />
          </div>

          <button
            type="button"
            className="account-primary-btn"
            onClick={handleSubmit}
          >
            Create Event
          </button>

          {message && (
            <p style={{ marginTop: "14px", textAlign: "center" }}>{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}