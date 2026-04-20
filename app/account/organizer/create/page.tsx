'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { getOrganizerId, getArtists, getVenues, createEvent } from "@/app/actions";
import { Artist } from "@/app/globalComponents/Artist";
import { Venue } from "@/app/globalComponents/Venue";
import { NewArtist } from "./NewArtist";
import { NewVenue } from "./NewVenue";
import { EventFormData } from "../EventFormData";

const TICKET_LEVEL_LABELS: Record<number, string> = { 1: "Basic Ticket", 2: "Premium Ticket", 3: "Elite Ticket" };

export default function CreateEventForm() {
const [artists, setArtists] = useState<any>([]);
const [venues, setVenues] = useState<any>();
const [tierCount, setTierCount] = useState(1);
const [showArtistModal, setShowArtistModal] = useState(false);
const [showVenueModal, setShowVenueModal] = useState(false);
const [message, setMessage] = useState("");
const [cookies] = useCookies();
const [ orgId, setOrgId ] = useState(-1);
const router = useRouter();

const {
register,
handleSubmit,
formState: { errors, isSubmitting },
} = useForm<EventFormData>({
    defaultValues: {
        prices: [
        { tier: "1", price: 0.0 , quantity: 0 },
        { tier: "2", price: 0.0 , quantity: 0 },
        { tier: "3", price: 0.0 , quantity: 0 },
        ],
    },
});

const getInfo = async () => {
    const artist_results = await getArtists();
    if (artist_results.success) {
        setArtists(artist_results.artists);
    } else {
        setMessage(`Could not fetch artists: ${artist_results.error}`);
    }
    if (orgId !== -1){
        const venue_results = await getVenues(orgId);
        if (venue_results.success) {
            setVenues(venue_results.venues);
        } else {
            setMessage(`Could not fetch venues: ${venue_results.error}`)
        }
    }
}

useEffect(() => {
    const setUp = async () => {
        const org = await getOrganizerId(cookies.email);
        if (org.success) {
            setOrgId(org.id);
        } else {
            setMessage("Could not fetch organizer id.")
        }
        await getInfo();
    }
    setUp();
}, [cookies.email, orgId]);

const handleNewArtist = (result:any) => {
    if (result.success) {
        setArtists((prev:any) => [...prev, result.artist]);
        setShowArtistModal(false);
    } else {
        setMessage(result.error);
    }  
};

const handleNewVenue = (result:any) => {
    if (result.success) {
        setVenues((prev:any) => [...prev, result.venue]);
        setShowVenueModal(false);
    } else {
        setMessage(result.error);
    }
};

const onSubmit = async (data:any) => {
    setMessage("");
    data.prices = JSON.stringify(data.prices
        .slice(0, tierCount)
        .map((p:any, i:any) => ({ 
            tier: i + 1, 
            price: parseFloat(p.price),
            quantity: parseInt(p.quantity),
        })));
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            fd.append(key, value.toString());
        }
    });

    try {
        const result = await createEvent(orgId, fd);
        if (result.success) {
            router.push(`/account/organizer/manage/${result.event_id}`);
        } else {
            setMessage(`${result.error}`);
        }
    } catch (e) {
        console.error("Could not create event.", e)
        setMessage(`Could not create event: ${e}`);
    }
};

return (
    <div className="container">
          <h1>Create Event</h1>
          <p>Fill in the details below to publish a new event.</p>

        {message && (
          <div>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

              <div className="input-group">
                <label className="input-label" htmlFor="name">Event Name</label>
                <input
                  id="name"
                  className="input-box"
                  type="text"
                  placeholder="Event Name"
                  {...register("name", { required: true, maxLength: 125 })}
                />
                {errors.name && <span className="error-msg">Event name is required (max 125 chars)</span>}
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="input-label" htmlFor="date">Date / Time</label>
                  <input
                    id="date"
                    className={"input-box"}
                    type="datetime-local"
                    {...register("date", { required: true })}
                  />
                  {errors.date && <span className="error-msg">Date is required</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="category">Category</label>
                  <select
                    id="category"
                    className={"input-box"}
                    {...register("category", { required: true })}
                  >
                    <option value="">Select category…</option>
                    <option value="liveMusic">Live Music</option>
                    <option value="dj">DJ Set/Dance Party</option>
                  </select>
                  {errors.category && <span className="error-msg">Category is required</span>}
                </div>
              <div className="input-group">
                <label className="input-label" htmlFor="artist_id">Artist</label>
                  <select
                    id="artist_id"
                    className={"input-box"}
                    {...register("artist_id", { required: true })}
                  >
                    <option value="">Select an artist…</option>
                    {artists.map((a:Artist) => (
                      <option key={a.artist_id} value={a.artist_id}>
                        {a.name} — {a.genre}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowArtistModal(true)}
                  >
                    + New Artist
                  </button>
                  {showArtistModal && (
                    <>
                        <NewArtist onSend={handleNewArtist} />
                        <button onClick={() => setShowArtistModal(false)}>Cancel New Artist</button>
                    </>
                )}
                {errors.artist_id && <span className="error-msg">Please select or create an artist</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="venue_id">Venue</label>
                  <select
                    id="venue_id"
                    className={"input-box"}
                    {...register("venue_id", { required: true })}
                  >
                    <option value="">Select a venue…</option>
                    {venues ? venues.map((v:Venue) => (
                      <option key={v.venue_id} value={v.venue_id}>
                        {v.name} — {v.city}, {v.state}
                      </option>
                    )) : ""}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowVenueModal(true)}
                  >
                    + New Venue
                  </button>
                    {showVenueModal && (
                        <>
                            <NewVenue onSend={handleNewVenue} orgId={orgId} />
                            <button onClick={() => setShowVenueModal(false)}>Cancel New Venue</button>
                        </>
                    )}
                
                {errors.venue_id && <span className="error-msg">Please select or create a venue</span>}
              </div>

              <div>
                <label className="input-label">
                  Number of pricing tiers
                </label>
                <div className="tier-selector">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={"tier-btn"}
                      onClick={() => setTierCount(n)}
                    >
                      {n} {n === 1 ? "Tier" : "Tiers"}
                    </button>
                  ))}
                </div>
              </div>

              {[0, 1, 2].slice(0, tierCount).map((i) => (
                <div className="tier-block" key={i}>
                  <div className="tier-label">{TICKET_LEVEL_LABELS[i + 1]}</div>
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label" htmlFor={`prices.${i}.ticket_type.price`}>
                        Price (USD)
                      </label>
                      <input
                        id={`prices.${i}.ticket_type.price`}
                        className="input-box"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register(`prices.${i}.price`, {
                          required: i < tierCount,
                          min: 0,
                          valueAsNumber: true,
                        })}
                      />
                      {errors.prices?.[i]?.price && (
                        <span className="error-msg">Valid price required</span>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor={`prices.${i}.quantity`}>
                        Quantity
                      </label>
                      <input
                        id={`prices.${i}.quantity`}
                        className={"input-box"}
                        type="number"
                        min="1"
                        placeholder="100"
                        {...register(`prices.${i}.quantity`, {
                          required: i < tierCount,
                          min: 1,
                          valueAsNumber: true,
                        })}
                      />
                      {errors.prices?.[i]?.quantity && (
                        <span className="error-msg">Quantity required</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Event"}
            </button>

          </div>
        </form>
    </ div>
  );
}
