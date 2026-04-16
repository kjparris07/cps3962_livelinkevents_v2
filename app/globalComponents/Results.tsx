import { Event } from "@/app/globalComponents/Event";
import { getAllEvents, searchArtists, searchDates, searchStates } from "../actions";
export async function Results(type:string, fd: FormData):Promise<any> {

  let results = [];

  if (type === "artist") results = await searchArtists(fd);
  if (type === "state") results = await searchStates(fd);
  if (type === "date") results = await searchDates(fd);

  return (
    results.length > 0
    ? 
    results.map((event) => (
      <div key={event.event_id} className="event-card">
        {event.artist_image ? (
          <img 
            src={event.artist_image} 
            alt={event.artist_name} 
            className="artist-img" 
          />
        ) : (
          <div className="artist-img-placeholder">
            No Image
          </div>
        )}
        <div className="event-info">
          <h1 className="artist-name">{event.artist_name}</h1>
          <h2 className="event-name">{event.event_title}</h2>
          <h3 className="event-date">{event.event_date.toLocaleDateString()}</h3>
          <h4 className="event-category">{event.event_category}</h4>
          <h4 className="event-venue">{event.venue_name}</h4>
          <p className="event-location">{event.venue_city}, {event.venue_state}</p>
        </div>
        <button className="purchase-tkt-btn">Purchase Tickets</button>
      </div>
    ))
    :
    <p className="no-results">No events found. Try another search!</p>
  );
}