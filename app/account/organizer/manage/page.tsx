"use client"
import { Event } from "@/app/globalComponents/Event";
import { Ticket } from "@/app/globalComponents/Ticket";
import Link from "next/link";
import "@/styles/main.css";
import "@/styles/events.css";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getOrganizerEvents } from "@/app/actions";

export default function EventsPage() {
  const [ events, setEvents ] = useState<Event[]>();
  const [ message, setMessage] = useState("");
  const [ cookies ] = useCookies();
  
  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const results = await getOrganizerEvents(cookies.email);
            results.data?.forEach((event) => {
                const rawDbString = event.tickets;
                const ticketRegex = /\(\\\"\((\d+),([\d.]+)\)\\\",(\d+)\)/g;

                const tickets: Ticket[] = [];
                let match;

                while ((match = ticketRegex.exec(rawDbString)) !== null) {
                    tickets.push({
                        tier: match[1], 
                        price: parseFloat(match[2]),
                        quantity: parseInt(match[3], 10),
                    });
                }
                event.tickets = tickets;
            });
            setEvents(results.data);
        } catch (error) {
            setMessage(`${error}`);
        }
    }
    if (!cookies.email) return;
    fetchEvents();
  }, [cookies.email]);

  if (!events) {
    return <h3 className="search-title">Finding events...</h3>;
  }

 return (
    <main className="container">
      <h1 className="events-title">All Events</h1>
      <div className="error">
        {message}
      </div>

      <section className="events-grid">
        {events?.map((event) => (
          <div key={event.event_id} className="event-card">
            <div className="event-left">
                <h2 className="event-title">
                    <Link href={`/account/organizer/manage/${event.event_id}`}>
                        {event.event_title}
                    </Link>
                </h2>

              <p className="event-info">
                <strong>Date:</strong> {event.event_date.toDateString()}
              </p>
              <p className="event-info">
                <strong>Time:</strong> 7:00 PM
              </p>
              <p className="event-info">
                <strong>Location:</strong> {event.venue_city}, {event.venue_state}
              </p>

              <Link href={`/events/${event.event_id}`} className="view-events-btn">
                View Tickets
              </Link>
            </div>

            <div className="event-right">
              <img
                src={event.artist_image}
                alt={event.event_title}
                className="artist-image"
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
