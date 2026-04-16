import Link from "next/link";
import "../../../styles/main.css";
import "../../../styles/ticket.css";

export default function Event16Page() {
  const event = {
   id: "16",
    title: "The Weeknd – After Hours Til Dawn Tour",
    date: "2026-07-18",
    location: "New York City, NY",
    venue:"Radio City Music Hall",
    price: 210,
    fees: { service: 18, tax: 12 },
    notify: true,
}

  return (
    <main className="ticket-container">

      {/* Title */}
      <h1 className="ticket-title">{event.title}</h1>

      {/* Event Info */}
      <div className="ticket-info-box">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> 7:00 PM</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
      </div>

      

      {/* Ticket Options */}
      <section className="ticket-section">
        <h2 className="section-title">Choose Your Tickets</h2>

        <div className="ticket-options">

          {/* GENERAL ADMISSION */}
          <div className="ticket-card">
            <h3>General Admission</h3>
            <p className="price">${event.price}</p>

            <label>Quantity</label>
            <select className="qty-select">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>

            <Link
              href={`/events/${event.id}/payment?type=general`}
              className="buy-btn"
            >
              Continue
            </Link>
          </div>

          {/* PREMIUM (LOCKED) */}
          <div className="ticket-card locked">
            <h3>Premium</h3>
            <p className="price">${event.price + 80}</p>

            <p className="locked-text">Premium plan required</p>

            <Link href="/membership" className="upgrade-btn">
              Upgrade to Premium
            </Link>
          </div>

          {/* ELITE (LOCKED) */}
          <div className="ticket-card locked">
            <h3>Elite</h3>
            <p className="price">${event.price + 150}</p>

            <p className="locked-text">Elite plan required</p>

            <Link href="/membership" className="upgrade-btn">
              Upgrade to Elite
            </Link>
          </div>

        </div>
      </section>

      {/* Fees */}
      <section className="ticket-section">
        <h2 className="section-title">Fees</h2>
        <p>Service Fee: ${event.fees.service}</p>
        <p>Tax: ${event.fees.tax}</p>
      </section>

      {/* Notifications */}
      <section className="ticket-section">
        <h2 className="section-title">Ticket Notifications</h2>
        <form className="notification-form">
          <label className="field-label">
            Email for ticket updates
            <div className="email-box">
            <input
              type="email"
              name="email"
              className="input-box"
              placeholder="you@example.com"
              required
            />
            </div>
          </label>
        
          <label className="field-label checkbox-row">
            <input type="checkbox" name="notify" defaultChecked={event.notify} />
            Notify me about price changes and availability
          </label>

          <button type="submit" className="save-notification">
            Save Notification Preference
          </button>
        </form>
      </section>

    </main>
  );
}