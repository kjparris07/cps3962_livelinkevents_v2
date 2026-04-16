"use server";

import { events } from "@/lib/events";
import Link from "next/link";

export async function Results(type: string, formData: FormData) {
  const artist = formData.get("artist")?.toString().toLowerCase() || "";
  const location = formData.get("location")?.toString().toLowerCase() || "";
  const date = formData.get("date")?.toString() || "";
  const state = formData.get("state")?.toString().toLowerCase() || "";

  const filtered = events.filter((event) => {
    // FIX: event.title is the artist name
    const matchesArtist = artist
      ? event.title.toLowerCase().includes(artist)
      : true;

    const matchesLocation = location
      ? event.location.toLowerCase().includes(location)
      : true;

    const matchesState = state
      ? event.location.toLowerCase().includes(state)
      : true;

    const matchesDate = date ? event.date === date : true;

    return matchesArtist && matchesLocation && matchesState && matchesDate;
  });

  if (filtered.length === 0) {
    return (
      <div className="no-results">
        <h2>No events found</h2>
        <p>Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="events-list">
      {filtered.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.location}</p>
          <p>{event.date}</p>
        </Link>
      ))}
    </div>
  );
}