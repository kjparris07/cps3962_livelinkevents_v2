"use client"
import { events } from "@/lib/events";
import Link from "next/link";
import "../../styles/main.css";
import "../../styles/events.css";
import { useState } from "react";

export default function EventsPage() {
  const [sortOption, setSortOption] = useState("default");

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortOption) {
      case "az":
        return a.title.localeCompare(b.title);

      case "date":
        return new Date(a.date) - new Date(b.date);

      case "priceLow":
        return a.price - b.price;

      case "priceHigh":
        return b.price - a.price;

      default:
        return 0;
    }
  });

  return (
    <main className="container">
      <h1 className="events-title">All Events</h1>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="az">Alphabetical (A–Z)</option>
          <option value="date">Closest Date</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </div>

      <section className="events-grid">
        {sortedEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-left">
              <h2 className="event-title">{event.title}</h2>

              <p className="event-info">
                <strong>Date:</strong> {event.date}
              </p>
              <p className="event-info">
                <strong>Time:</strong> 7:00 PM
              </p>
              <p className="event-info">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="event-info">
                <strong>Starting at:</strong> ${event.price}
              </p>

              <Link href={`/events/${event.id}`} className="view-events-btn">
                View Tickets
              </Link>
            </div>

            <div className="event-right">
              <img
                src={`/artists/${event.id}.jpg`}
                alt={event.title}
                className="artist-image"
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
