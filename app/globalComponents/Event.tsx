import { Ticket } from "./Ticket";

export type Event = {
    event_id: string;
    artist_image: string;
    artist_name: string;
    event_title: string;
    event_date: Date;
    event_category: string;
    venue_name: string;
    venue_city: string;
    venue_state: string;
    tickets: Ticket[];
}