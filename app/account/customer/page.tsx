"use client"

import Link from "next/link";
import { useCookies } from "react-cookie";
import { getAccountInfo, getCustomerEvents } from "@/app/actions";
import { useEffect, useState } from "react";
import { setCustomer } from "@/app/actions";
import { CustomerDBInfo } from "@/app/globalComponents/CustomerDBInfo";

import "@/styles/main.css";
import "@/styles/signin.css";
import "@/styles/account.css";

export default function CustomerAccountPage() {
    const [cookies] = useCookies();
    
    const [customer, setCustomerData] = useState<CustomerDBInfo | null>(null);
    const [events, setEvents] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchInfo = async () => {
        if (cookies.email) {
          try {
            const db_info = await getAccountInfo("customer", cookies.email);

            if (db_info.success) {
              setCustomerData(await setCustomer(db_info.info));
              const customer_events = await getCustomerEvents(cookies.email);
              if (customer_events.success) {
                const results = customer_events.data;
                if (results && results.length > 0) {
                  setEvents(results.map((event) => (
                    <div key={event.event_id} className="event-info">
                      <h3 className="event-date">{event.event_date.toLocaleDateString()} — {event.event_title}</h3>
                      <h4 className="event-artist">{event.artist_name}</h4>
                      <h5 className="event-location">{event.venue_city}, {event.venue_state}</h5>
                    </div>
                  )));
                } else {
                  setEvents(["<p className='no-results'>No events found. Try buying a ticket!</p>"]);
                }
              }
              
            } 
          } catch (err) {
            console.error("Fetch error:", err);
          }
        }
        setLoading(false);
    };

    fetchInfo();
  }, [cookies.email]);

  if (loading) return <div className="account-page">Loading...</div>;
  
  if (!customer) return <div className="account-page">No account info found.</div>;

  return (
    <main className="account-page">
      <section className="account-wrapper">
        <div className="account-header">
          <p className="account-subheading">My Account</p>
          <h1 className="account-title-main">
            Welcome back{customer.fName ? `, ${customer.fName}` : ""}!
          </h1>
          <p className="account-description">
            Manage your profile, tickets, membership, and preferences all in one
            place.
          </p>
        </div>

        <div className="account-grid">
          <div className="account-card">
            <h2>Profile Information</h2>
            <p>
              <strong>Full Name:</strong> {customer.fName + ' ' + customer.lName || "Not added"}
            </p>
            <p>
              <strong>Email:</strong> {customer.email || "Not added"}
            </p>
            <p>
              <strong>Phone Number:</strong> {customer.phone || "Not added"}
            </p>
            <p>
              <strong>Date of Birth:</strong> {customer.dob.toDateString() || "" }
            </p>

            <div className="account-card-actions">
              <Link href="/account/customer/edit" className="account-primary-btn">
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Membership</h2>
            <p>
              <strong>LiveLink Member Since:</strong>{customer.date_reg.toDateString() || ""}
            </p>
            <p>
              <strong>Current Plan:</strong> {customer.plan || "Basic Free Plan"}
            </p>
            <p>
              Enjoy early access opportunities, event alerts, and account tools
              based on your plan.
            </p>

            <div className="account-card-actions">
              <Link href="/membership" className="account-primary-btn">
                Manage Membership
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Upcoming Tickets</h2>
            {events}
          </div>

          <div className="account-card">
            <h2>Saved Preferences</h2>
            <p>
              <strong>Favorite Genre:</strong> {customer.faveGenre || "Not Added"}
            </p>
            <p>
              <strong>Favorite Artist:</strong> {customer.faveArtist || "Not Added"}
            </p>
            <p>
              <strong>Preferred State:</strong> {customer.homeState || "Not Added"}
            </p>

            <div className="account-card-actions">
              <Link href="/account/customer/edit" className="account-primary-btn">
                Update Preferences
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Notifications & Privacy</h2>
            <p>
              <strong>Ticket Alerts:</strong>{" "}
              {customer.alerts ? "Enabled" : "Disabled"}
            </p>
            <p>
              <strong>Marketing Emails:</strong>{" "}
              {customer.emails ? "Enabled" : "Disabled"}
            </p>
            <p>
              <strong>Profile Visibility:</strong>{" "}
              {customer.private ? "Private" : "Public"}
            </p>

            <div className="account-card-actions">
              <Link href="/account/customer/edit" className="account-primary-btn">
                Edit Settings
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Account Actions</h2>
            <p>Need to update your information or remove your account?</p>

            <div className="account-card-actions stacked-actions">
              <Link href="/account/customer/edit" className="account-primary-btn">
                Edit Account
              </Link>

              <Link
                href="/account/customer/delete"
                className="account-secondary-btn"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}