import { Ticket } from "@/app/globalComponents/Ticket"

export type EventFormData = {
    name: string,
    date: Date,
    artist_id: number,
    venue_id: number,
    organizer_id: number,
    category: string,
    prices: Ticket[]
}