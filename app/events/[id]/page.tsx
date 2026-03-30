import { events } from "@/lib/events";

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find(e => e.id === params.id);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Base Price: ${event.price}</p>

      <h2>Fees</h2>
      <p>Service: ${event.fees.service}</p>
      <p>Tax: ${event.fees.tax}</p>

      <h2>Deals</h2>
      <ul>
        {event.deals.map((deal, index) => (
          <li key={index}>{deal}</li>
        ))}
      </ul>

      <h2>Budget Options</h2>
      <ul>
        {event.budget.map((b, index) => (
          <li key={index}>
            {b.type}: ${b.price}
          </li>
        ))}
      </ul>

      <h2>Notify</h2>
      <p>{event.notify ? "Notifications available" : "No notifications"}</p>
    </div>
  );
}
