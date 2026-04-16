import { events } from "@/lib/events";
import Link from "next/link";
import "../../../../styles/main.css";
import "../../../../styles/events.css";

export default function TicketPaymentPage({ params }) {
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
      <h1 className="title">Payment for {event.title}</h1>
      <p>{event.location}</p>
      <p>{event.date}</p>

      <section className="ticket-section">
        <h2>Select Ticket Type</h2>
        <form className="payment-form">
          <label className="field-label">
            Ticket Option
            <select name="ticket" className="input-box">
              {event.budget.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.type} – ${option.price}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Card Number
            <input type="text" className="input-box" placeholder="1234 5678 9012 3456" required />
          </label>

          <label className="field-label">
            Expiration Date
            <input type="text" className="input-box" placeholder="MM/YY" required />
          </label>

          <label className="field-label">
            CVV
            <input type="text" className="input-box" placeholder="123" required />
          </label>

          <Link
            href={`/events/${event.id}/confirmation`}
            className="babyButton"
            style={{ marginTop: "20px", display: "inline-block" }}
          >
            Complete Purchase
          </Link>
        </form>
      </section>
    </main>
  );
}