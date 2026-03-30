import Link from "next/link";
import { events } from "@/lib/events";

export default function EventsPage() {
  return (
    <div>
      <h1>Events</h1>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link href={`/events/${event.id}`}>
              {event.title} - ${event.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
