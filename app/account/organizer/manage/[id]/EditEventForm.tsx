'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { EventFormData } from "../../EventFormData";
import { Ticket } from "@/app/globalComponents/Ticket";
import { Artist } from "@/app/globalComponents/Artist";
import { Venue } from "@/app/globalComponents/Venue";
import { updateEvent, deleteEvent } from "@/app/actions";

const TIER_LABELS: Record<number, string> = {
  1: "Basic",
  2: "Premium",
  3: "Elite",
};

type EditEventFormProps = {
  event: EventFormData;
  event_id: string;
  org_id: string;
  artists: Artist[];
  venues: Venue[];
};

export default function EditEventForm({
  event,
  event_id,
  org_id,
  artists,
  venues,
}: EditEventFormProps) {
  const [tierCount, setTierCount] = useState(event.prices.length || 1);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
        name: event.name,
        date: event.date.toISOString().slice(0, 16),
        artist_id: event.artist_id,
        venue_id: event.venue_id,
        category: event.category,
        prices: [0, 1, 2].map((i) => ({
            tier: i + 1,
            price: event.prices[i]?.price,
            quantity: event.prices[i]?.quantity,
        }))
    },
  });

  const onSubmit = async (data: any) => {
    data.date = new Date(data.date).toISOString();
    data.prices = JSON.stringify(data.prices
        .slice(0, tierCount)
        .map((p:any, i:any) => ({ 
            tier: i + 1, 
            price: parseFloat(p.price),
            quantity: parseInt(p.quantity),
        }))
    );
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (!(key in dirtyFields)) return;

        if (value !== undefined && value !== null && value !== "") {
            fd.append(key, value.toString());
        }
    });

    if (!Object.keys(dirtyFields).length) {
        router.push("/account/organizer");
        return;
    }

    const result = await updateEvent(`${event_id}`, fd);
    if (result.success) {
        router.push("/account/organizer");
    } else {
        setMessage(`${result.error}`);
    }
}

    const handleDelete = async () => {
        const result = await deleteEvent(event_id);
        if (result.success) router.push("/account/organizer/");
        else setMessage(`${result.error}`);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {message && <div className="error">{message}</div>}
        <div className="input-group">
            <label className="input-label" htmlFor="name">Event Name</label>
            <input
            id="name"
            className={`input-box`}
            type="text"
            placeholder="Event Name"
            {...register("name", { required: true, maxLength: 125 })}
            />
            {errors.name && <span className="error-msg">Required (max 125 chars)</span>}
        </div>

        <div className="input-group">
            <label className="input-label" htmlFor="date">Date</label>
            <input
            id="date"
            className={`input-box`}
            type="datetime-local"
            {...register("date", { required: true })}
            />
            {errors.date && <span className="error-msg">Required</span>}
        </div>

        <div className="input-group">
            <label className="input-label" htmlFor="category">Category</label>
            <select
            id="category"
            className={`input-box`}
            {...register("category", { required: true })}
            >
                <option value="">Select category…</option>
                <option value="liveMusic">Live Music</option>
                <option value="dj">DJ Set/Dance Party</option>
            </select>
            {errors.category && <span className="error-msg">Required</span>}
        </div>

        <div className="input-group">
            <label className="input-label" htmlFor="artist_id">Artist</label>
            <select
            id="artist_id"
            className={`input-box`}
            {...register("artist_id", { required: true })}
            >
            <option value="">Select an artist…</option>
            {artists.map((a) => (
                <option key={a.artist_id} value={a.artist_id}>{a.name} — {a.genre}</option>
            ))}
            </select>
            {errors.artist_id && <span className="error-msg">Required</span>}
        </div>

        <div className="input-group">
            <label className="input-label" htmlFor="venue_id">Venue</label>
            <select
            id="venue_id"
            className={`input-box`}
            {...register("venue_id", { required: true })}
            >
            <option value="">Select a venue…</option>
            {venues.map((v) => (
                <option key={v.venue_id} value={v.venue_id}>{v.name} — {v.city}, {v.state}</option>
            ))}
            </select>
            {errors.venue_id && <span className="error-msg">Required</span>}
        </div>

        {/* Ticket Pricing */}
        <div className="input-group">
            <label className="input-label">Pricing Tiers</label>
            <div>
            {[1, 2, 3].map((n) => (
                <button
                key={n}
                type="button"
                className={`btn-add`}
                onClick={() => setTierCount(n)}
                >
                {n} {n === 1 ? "Tier" : "Tiers"}
                </button>
            ))}
            </div>

            {[0, 1, 2].slice(0, tierCount).map((i) => (
            <div key={i}>
                <div className="input-label">
                {TIER_LABELS[i + 1]}
                </div>
                <div>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label" htmlFor={`prices.${i}.price`}>Price (USD)</label>
                    <input
                    className={`input-box`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register(`prices.${i}.price` as any, { required: true, min: 0 })}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor={`prices.${i}.quantity`}>Quantity</label>
                    <input
                    className={`input-box`}
                    type="number"
                    min="1"
                    placeholder="100"
                    {...register(`prices.${i}.quantity` as any, { required: true, min: 1 })}
                    />
                </div>
                </div>
            </div>
            ))}
        </div>

        <div>
            {confirmDelete ? (
                <div>
                <span className="input-label">Are you sure?</span>
                <button type="button" className="btn-add" onClick={handleDelete}>Yes, delete</button>
                <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
            ) : (
                <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(true)}>
                Delete Event
                </button>
            )
            }

            <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            >
            {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
        </div>

        </form>
    );
}