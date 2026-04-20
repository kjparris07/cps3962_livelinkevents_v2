'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Ticket } from '@/app/globalComponents/Ticket';
import { 
    getEvent, 
    getArtists, 
    getVenues, 
    getOrganizerId 
} from '@/app/actions'; 
import { Artist } from '@/app/globalComponents/Artist';
import { Venue } from '@/app/globalComponents/Venue';
import EditEventForm from './EditEventForm';
import { EventFormData } from '../../EventFormData';
import { getFullEvent } from '@/app/actions';


type PageProps = {
  params: Promise<{ id: string }>; 
};

export default function ManageEvents({ params }: PageProps) {
    const {id} = React.use(params);
    const [orgId, setOrgId] = useState(-1);
    const [event, setEvent] = useState<EventFormData>();
    const [artists, setArtists] = useState<Artist[]>();
    const [venues, setVenues] = useState<Venue[]>();
    const [message, setMessage] = useState("");
    const [ cookies ] = useCookies();

    useEffect(() => {
        const fetchInfo = async (id: string) => {
            try {
                const fetchId = (await getOrganizerId(cookies.email)).id;
                setOrgId(fetchId);

                const fetchEvent = (await getFullEvent(id)).result; 

                const [artistsRes, venuesRes] = await Promise.all([
                    getArtists(),
                    getVenues(fetchId),
                ]);
                setArtists(artistsRes.artists);
                setVenues(venuesRes.venues);

                const rawDbString = fetchEvent.prices;
                const ticketRegex = /\(\\\"\((\d+),([\d.]+)\)\\\",(\d+)\)/g;
                const tickets: Ticket[] = [];
                let match;
                while ((match = ticketRegex.exec(rawDbString)) !== null) {
                    tickets.push({
                        tier: match[1],
                        price: parseFloat(match[2]),
                        quantity: parseInt(match[3], 10),
                    });
                }
                setEvent({
                    name: fetchEvent.name,
                    date: new Date(fetchEvent.date),
                    artist_id: fetchEvent.artist_id,
                    venue_id: fetchEvent.venue_id,
                    organizer_id: orgId,
                    category: fetchEvent.category,
                    prices: tickets as Ticket[]
                });
            } catch (error) {
                setMessage(`${error}`);
            }
        };
        if (!id) return;
        fetchInfo(id);
    }, [cookies.email, id]);

    if ((event == undefined) || !orgId || !id || !artists?.length || !venues?.length) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {message && <div className="error">
                {message}
            </div>}
            <EditEventForm 
                event={event as EventFormData}
                event_id={id}
                org_id={`${orgId}`}
                artists={artists as Artist[]}
                venues={venues as Venue[]}
            />
        </>
    );
}
