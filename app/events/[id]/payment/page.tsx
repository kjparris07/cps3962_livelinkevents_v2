"use client"

import { Event } from "@/app/globalComponents/Event";
import { Ticket } from "@/app/globalComponents/Ticket";
import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getEvent, purchaseTicket } from "@/app/actions";
import Link from "next/link";
import "@/styles/events.css";
import "@/styles/main.css";
import "@/styles/payment.css";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>; 
};

export default function TicketPaymentPage({params}:PageProps) {
  const [cookies] = useCookies();
  const [ event, setEvent ] = useState<Event>();
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const {id} = React.use(params);
  const { handleSubmit } = useForm();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted ? cookies.email : null;

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getEvent(id);
      if (result.success) {
        const rawDbString = result.result.tickets;
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
        result.result.tickets = tickets;
        setEvent(result.result);
      } else {
        console.error(result.error);
      }
    }
    fetchEvent();
  }, []);

  const onSubmit = async () => {
    try {
      if (isLoggedIn && event){
        const purchase = await purchaseTicket(cookies.email, event.event_id);
        if (purchase.success) {
          router.push(`/events/${event.event_id}/confirmation`);
        } else {
          throw Error(`${purchase.error}`);
        }
      }
    } catch (error) {
      setMessage(`${error}`);
    }
  }

  if (!event) {
    return (
      <main className="container">
        <h1>Loading...</h1>
        <Link href="/events" className="view-events-btn">
          Back to all events
        </Link>
      </main>
    );
  }

  return (
    <main className="payment-container ">

      <div className="error">{message}</div>
      <h1 className="title">Payment for {event.event_title}</h1>
      <p>{event.venue_city}, {event.venue_state}</p>
      <p>{event.event_date.toDateString()}</p>

      <section className="ticket-section">
        <h2>Select Ticket Type</h2>
        <form className="payment-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="field-label">
            Ticket Option
            <select name="ticket" className="input-box">
              {event.tickets.map((option) => (
              <option key={option.tier} className="ticketType" value={option.price} >
                {option.tier == "1" ? "Basic" : option.tier == "2" ? "Premium" : "Elite"} – ${option.quantity > 0 ? option.price : "SOLD OUT"}
              </option>
            ))}
            </select>
          </label>

          <label className="field-label">
            Card Number
            <input type="text" className="input-box" placeholder="1234 5678 9012 3456" required />
          </label>

          <label className="field-label">
            Expiration Date
            <input type="text" className="input-box" placeholder="MM/YY" required />
          </label>

          <label className="field-label">
            CVV
            <input type="text" className="input-box" placeholder="123" required />
          </label>

          <button className="view-events-btn" style={{ marginTop: "20px", display: "inline-block" }}>
            Complete Purchase
          </button>
        </form>
      </section>
    </main>
  );
}