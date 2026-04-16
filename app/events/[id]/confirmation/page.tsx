import { events } from "@/lib/events";
import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/events.css";

export default function ConfirmationPage({ params }) {
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    return (
      <main className="container">
        <h1>Event not found</h1>
        <Link href="/events" className="view-events-btn">
          Back to all events
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="title">🎉 Purchase Confirmed!</h1>
      <p>You’re all set for:</p>

      <section className="ticket-section">
        <h2>{event.title}</h2>
        <p>{event.location}</p>
        <p>{event.date}</p>
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