import { events } from "@/lib/events";
import Link from "next/link";

export default function EventsPage({ searchParams }) {
  const { location, date, artist } = searchParams;

  const hasFilters = location || date || artist;

  let filtered = events.filter((event) => {
    const matchLocation = location
      ? event.location.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchDate = date ? event.date === date : true;

    const matchArtist = artist
      ? event.title.toLowerCase().includes(artist.toLowerCase())
      : true;

    return matchLocation && matchDate && matchArtist;
  });

  const noResults = hasFilters && filtered.length === 0;

  return (
    <div>
      <h1>Events</h1>

      {noResults && (
        <>
          <p>No matching events found.</p>
          <h3>Related Events</h3>
          {events.map((event) => (
            <div key={event.id}>
              <Link href={`/events/${event.id}`}>
                <p>{event.title}</p>
              </Link>
            </div>
          ))}
        </>
      )}

      {!noResults &&
        filtered.map((event) => (
          <div key={event.id} className="event-card">
            <Link href={`/events/${event.id}`}>
              <h2>{event.title}</h2>
            </Link>
            <p>{event.location}</p>
            <p>{event.date}</p>
          </div>
        ))}
    </div>
  );
}