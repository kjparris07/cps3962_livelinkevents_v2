import { events } from "@/lib/events";

export default function EventPage({ params }) {
  const event = events.find((e) => e.id === params.id);

  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <h1>{event.title}</h1>

      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Base Price:</strong> ${event.price}</p>

      <h3>Fees</h3>
      <p>Service Fee: ${event.fees.service}</p>
      <p>Tax: ${event.fees.tax}</p>

      <h3>Deals</h3>
      <ul>
        {event.deals.map((deal, i) => (
          <li key={i}>{deal}</li>
        ))}
      </ul>

      <h3>Budget Options</h3>
      <ul>
        {event.budget.map((tier, i) => (
          <li key={i}>
            {tier.type}: ${tier.price}
          </li>
        ))}
      </ul>

      <p><strong>Notify:</strong> {event.notify ? "Yes" : "No"}</p>
    </div>
  );
}