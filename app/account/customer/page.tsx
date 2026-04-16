'use client';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { getAccountInfo, setCustomer, getCustomerEvents } from '@/app/actions';
import { CustomerDBInfo } from '@/app/globalComponents/CustomerDBInfo';
import "@/styles/account.css";
import "@/styles/main.css";
import Link from 'next/link';

export default function CustomerPage() {
  const [cookies] = useCookies(['email']);
  const [customer, setCustomerData] = useState<CustomerDBInfo | null>(null);
  const [events, setEvents] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
                setEvents(results.map((event) => {
                  <div key={event.event_id} className="event-info">
                    <h3 className="event-date">{event.event_date.toLocaleDateString()} — {event.event_title}</h3>
                    <h4 className="event-artist">{event.artist_name}</h4>
                    <h5 className="event-location">{event.venue_city}, {event.venue_state}</h5>
                  </div>
                }));
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

  if (!customer || loading) return <div className="account-page">Loading...</div>;
  if (message) return <main>{message}</main>;

  return (
    <main className="account-page">
      <section className="account-wrapper">
        <div className="account-header">
          <p className="account-subheading">My Account</p>
          <h1 className="account-title-main">
            Welcome back{customer.first_name ? `, ${customer.first_name}` : ""}!
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
              <strong>Full Name:</strong> {customer.first_name + ' ' + customer.last_name || "Not added"}
            </p>
            <p>
              <strong>Email:</strong> {customer.email || "Not added"}
            </p>
            <p>
              <strong>Phone Number:</strong> {customer.phone || "Not added"}
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

            <div className="account-card-actions">
              <Link href="/events" className="account-primary-btn">
                View Events
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Saved Preferences</h2>
            <p>
              <strong>Favorite Genre:</strong> {customer.favegenre || "Not Added"}
            </p>
            <p>
              <strong>Favorite Artist:</strong> {customer.faveartist || "Not Added"}
            </p>
            <p>
              <strong>Preferred State:</strong> {customer.state || "Not Added"}
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