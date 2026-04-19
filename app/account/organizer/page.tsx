"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getAccountInfo, setOrganizer, getOrganizerEvents } from "@/app/actions";
import { OrganizerDBInfo } from "@/app/globalComponents/OrganizerDBInfo";
import "@/styles/main.css";
import "@/styles/signin.css";
import "@/styles/account.css";


export default function OrganizerAccountPage() {
  const [cookies] = useCookies();   
  const [organizer, setOrganizerData] = useState<OrganizerDBInfo | null>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
    if (cookies.email) {
      try {
        const db_info = await getAccountInfo("organizer", cookies.email);
        if (db_info.success) {
          setOrganizerData(await setOrganizer(db_info.info));
          const org_events = await getOrganizerEvents(cookies.email);
          if (org_events.success) {
            const results = org_events.data;
            if (results && results.length > 0) {
              setEvents(results.map((event) => (
                <div key={event.event_id} className="event-info">
                  <h3 className="event-date">{event.event_date.toLocaleDateString()} — {event.event_title}</h3>
                  <h4 className="event-artist">{event.artist_name}</h4>
                  <h5 className="event-location">{event.venue_city}, {event.venue_state}</h5>
                </div>
              )));
            } else {
              setEvents([<p key='no-results'>No events found. Try creating one!</p>]);
            }
          }
        } else {
          setMessage("Could not fetch from database.");
        }
      } catch (err) {
        setMessage(`Fetch error: ${err}`);
      }
    }
    setLoading(false);
  };
  
  fetchInfo();
  }, [cookies.email]);

  if (loading) return <div className="account-page">Loading...</div>;
  
  if (!organizer) {return <div className="account-page">No account info found.</div>;}

  return (
    <main className="account-page">

      <section className="account-wrapper">
        <div className="account-header">
          <p className="account-subheading">Organizer Dashboard</p>
          <h1 className="account-title-main">
            Welcome back{organizer.name ? `, ${organizer.name}` : ""}!
          </h1>
          <p>{ message ?? ""}</p>
          <p className="account-description">
            Manage your artist or company profile, event listings, media, sales,
            and organizer settings.
          </p>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <h2>Organizer Profile</h2>
            <p>
              <strong>Name:</strong> {organizer.name || "Not added"}
            </p>
            <p>
              <strong>Email:</strong> {organizer.email || "Not added"}
            </p>
            <p>
              <strong>Business Phone:</strong> {organizer.phone || "Not added"}
            </p>
            <p>
              <strong>Role Type:</strong> {organizer.role}
            </p>

            <div className="account-card-actions">
              <Link href="/account/organizer/edit" className="account-primary-btn">
                Edit Organizer Profile
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Organizer Status</h2>
            <p>
              <strong>Payout Method:</strong> {organizer.payout_method}
            </p>
            <p>
              <strong>Monthly Sales:</strong> ${2412.89}
            </p>

            <div className="account-card-actions">
              <button className="account-primary-btn" type="button">
                Update Payout Info
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Event Management</h2>
            <h3>Upcoming Events:</h3>
            {events}
            <p>
              Create, edit, and manage ticketed events listed through LiveLink.
            </p>

            <div className="account-card-actions stacked-actions">
              <button className="account-primary-btn" type="button">
                Create New Event
              </button>
              <button className="account-secondary-btn" type="button">
                Manage Events
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Artist / Brand Media</h2>
            <p>
              <strong>Website:</strong> {organizer?.website || "Not added"}
            </p>
            <p>
              <strong>Instagram:</strong> {organizer.instagram}
            </p>
            <p>
              <strong>Primary Genre:</strong> {organizer.genre}
            </p>

            <div className="account-card-actions stacked-actions">
              <button className="account-primary-btn" type="button">
                Upload Promo Media
              </button>
              <button className="account-secondary-btn" type="button">
                Edit Artist Info
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Sales & Audience Insights</h2>
            <p>
              <strong>Tickets Sold This Month:</strong> 128
            </p>
            <p>
              <strong>Top Performing City:</strong> Newark, NJ
            </p>
            <p>
              <strong>Most Interested Audience Genre:</strong> Pop / R&amp;B
            </p>

            <div className="account-card-actions">
              <button className="account-primary-btn" type="button">
                View Sales Details
              </button>
            </div>
          </div>

          <div className="account-card">
            <h2>Account Actions</h2>
            <p>
              Manage account security, organizer settings, or remove your organizer
              profile.
            </p>

            <div className="account-card-actions stacked-actions">
              <Link href="/account/organizer/edit" className="account-primary-btn">
                Edit Account
              </Link>

              <Link
                href="/account/organizer/delete"
                className="account-secondary-btn"
              >
                Delete Organizer Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}