async function getEvent(id: string) {
  const res = await fetch(`http://localhost:3000/api/events/${id}`);
  return res.json();
}

export default async function EventPage({ params }) {
  const event = await getEvent(params.id);

  if (!event || event.error) {
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
        {event.deals.map((deal, i) => (
          <li key={i}>{deal}</li>
        ))}
      </ul>

      <h2>Budget Options</h2>
      <ul>
        {event.budget.map((b, i) => (
          <li key={i}>
            {b.type}: ${b.price}
          </li>
        ))}
      </ul>

      <h2>Notify</h2>
      <p>{event.notify ? "Notifications available" : "No notifications"}</p>
    </div>
  );
}
