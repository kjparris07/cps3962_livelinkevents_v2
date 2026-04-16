import { events } from "@/lib/events";
import Link from "next/link";
import "../../../styles/main.css";
import "../../../styles/events.css";

export default function EventTicketPage({ params }) {
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
      <h1 className="title">{event.title}</h1>
      <p>{event.location}</p>
      <p>{event.date}</p>

      {/* Ticket Options */}
      <section className="ticket-section">
        <h2>Ticket Options</h2>
        <ul>
          {event.budget.map((option) => (
            <li key={option.type}>
              <strong>{option.type}</strong> – ${option.price}
            </li>
          ))}
        </ul>
      </section>

      {/* Deals */}
      <section className="ticket-section">
        <h2>Deals</h2>
        <ul>
          {event.deals.map((deal) => (
            <li key={deal}>{deal}</li>
          ))}
        </ul>
      </section>

      {/* Notifications */}
      <section className="ticket-section">
        <h2>Ticket Notifications</h2>
        <form className="notification-form">
          <label className="field-label">
            Email for ticket updates
            <input
              type="email"
              name="email"
              className="input-box"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field-label checkbox-row">
            <input type="checkbox" name="notify" defaultChecked={event.notify} />
            Notify me about price changes and availability
          </label>

          <button type="submit" className="babyButton">
            Save Notification Preference
          </button>
        </form>
      </section>

      {/* Payment */}
      <section className="ticket-section">
        <Link href={`/events/${event.id}/payment`} className="view-events-btn">
          Continue to Payment
        </Link>
      </section>
    </main>
  );
}