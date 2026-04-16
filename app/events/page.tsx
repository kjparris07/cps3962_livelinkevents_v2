"use client"
import { Event } from "@/app/globalComponents/Event";
import { Ticket } from "../globalComponents/Ticket";
import Link from "next/link";
import "../../styles/main.css";
import "../../styles/events.css";
import { useState, useEffect } from "react";
import { getAllEvents } from "../actions";

export default function EventsPage() {
  const [sortOption, setSortOption] = useState("default");
  const [ events, setEvents ] = useState<Event[]>();
  
  useEffect(() => {
    const fetchEvents = async () => {
      const results = await getAllEvents();
      results.forEach((event) => {
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
      setEvents(results);
    }
    fetchEvents();
  }, []);

  const sortedEvents = events?.sort((a, b) => {
    switch (sortOption) {
      case "az":
        return a.event_title.localeCompare(b.event_title);

      case "date":
        return new Date(a.event_date).valueOf() - new Date(b.event_date).valueOf();

      case "priceLow":
        return a.tickets[0].price - b.tickets[0].price;

      case "priceHigh":
        return a.tickets[a.tickets.length-1].price - b.tickets[b.tickets.length-1].price;
      
        default:
        return 0;
    }
  });

  if (!events) {
    return <h3>Finding events...</h3>;
  }

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
        {sortedEvents?.map((event) => (
          <div key={event.event_id} className="event-card">
            <div className="event-left">
              <h2 className="event-title">{event.event_title}</h2>

              <p className="event-info">
                <strong>Date:</strong> {event.event_date.toDateString()}
              </p>
              <p className="event-info">
                <strong>Time:</strong> 7:00 PM
              </p>
              <p className="event-info">
                <strong>Location:</strong> {event.venue_city}, {event.venue_state}
              </p>
              <p className="event-info">
                <strong>Starting at:</strong> ${event.tickets[0].price}
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
