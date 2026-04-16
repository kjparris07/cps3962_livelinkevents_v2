'use client'

import Link from "next/link";
import "@/styles/main.css";
import "@/styles/events.css";
import "@/styles/payment.css";

import * as React from "react";
import { useState, useEffect } from "react";
import { getEvent } from "@/app/actions";
import { Event } from "@/app/globalComponents/Event";

type PageProps = {
  params: Promise<{ id: string }>; 
};

export default function ConfirmationPage({params}: PageProps) {
  const [event, setEvent] = useState<Event>();
  const {id} = React.use(params);

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getEvent(id);
      if (result.success) {
        setEvent(result.result);
      } else {
        return(result.error);
      }
    }
    fetchEvent();
  }, [])

  if (!event) {
    return (
      <main className="container">
        <h1>Processing...</h1>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="title">🎉 Purchase Confirmed!</h1>
      <p>You’re all set for:</p>

      <section className="ticket-section">
        <h2>{event.event_title}</h2>
        <p>{event.venue_city}, {event.venue_state}</p>
        <p>{event.event_date.toDateString()}</p>
      </section>

      <section className="ticket-section">
        <p>Your ticket details have been emailed to you.</p>
        <Link href="/events" className="view-events-btn">
          Back to Events
        </Link>
      </section>
    </main>
  );
}