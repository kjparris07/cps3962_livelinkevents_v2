'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEvent } from "@/app/actions";
import { Event } from "@/app/globalComponents/Event";
import * as React from 'react';
import { Ticket } from "@/app/globalComponents/Ticket";
import "../../../styles/main.css";
import "../../../styles/events.css";

type PageProps = {
  params: Promise<{ id: string }>; 
};

export default function EventTicketPage({ params }: PageProps) {
  const [ event, setEvent ] = useState<Event>();
  const {id} = React.use(params);
  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getEvent(id);
      if (result.success) {
        const rawDbString = result.result.tickets;
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
        result.result.tickets = tickets;
        setEvent(result.result);
      } else {
        console.error(result.error);
      }
    }
    fetchEvent();
  }, []);

  if (!event) {
    return (
      <main className="container">
        <h1>Loading event...</h1>
        <Link href="/events" className="view-events-btn">
          Back to all events
        </Link>
      </main>
    );
  }

  return (
    <main className="container column-container">
      <div id="event-img" >
        <img className="artist-img" src={event.artist_image} alt={event.artist_name} />
      </div>
      

      <div>
        <h1>{event.event_title}</h1>
        <p>{event.venue_city}, {event.venue_state}</p>
        <p>{event.event_date.toDateString()}</p>
        {/* Ticket Options */}
        <section className="ticket-section">
          <h3>Ticket Options</h3>
          <ul>
            {event.tickets.map((option) => (
              <li key={option.tier} className="ticketType" value={option.price} >
                {option.tier == "1" ? "Basic" : option.tier == "2" ? "Premium" : "Elite"} – ${option.quantity > 0 ? option.price : "SOLD OUT"}
              </li>
            ))}
          </ul>
        </section>


        {/* Notifications */}
        <section className="ticket-section">
          <h4>Ticket Notifications</h4>
          <form className="notification-form">
            <label className="field-label">
              Email for ticket updates
              <input
                type="email"
                name="email"
                id="email-input"
                className="input-box"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field-label checkbox-row">
              <span>
                Notify me about price changes and availability
              </span>
              <span>
                <input className="checkbox" type="checkbox" name="notify" />
              </span>
            </label>

            <button type="submit" className="secondary-btn">
              Save Preference
            </button>
          </form>
        </section>

        {/* Payment */}
        <section className="ticket-section">
          <Link href={`/events/${id}/payment`} className="view-events-btn">
            Continue to Payment
          </Link>
        </section>
      </div>
    </main>
  );
}