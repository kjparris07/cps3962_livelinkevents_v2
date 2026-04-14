"use client"

import Link from "next/link";
import { useCookies } from "react-cookie";
import "../../../styles/main.css";
import "../../../styles/signin.css";
import "../../../styles/account.css";
import { getAccountInfo } from "@/app/actions";
import { useEffect, useState } from "react"; // Added useState

type CustomerDBInfo = {
    fName: string;
    lName: string;
    dob: Date;
    date_reg: Date;
    email: string;
    state?: string;
    phone?: string;
    plan?: string;
    genre?: string;
    artist?: string;
    alerts?: boolean;
    emails?: boolean;
    private?: boolean;
};

export default function CustomerAccountPage() {
    const [cookies] = useCookies(["email"]);
    
    const [customer, setCustomerData] = useState<CustomerDBInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchInfo = async () => {
        console.log("Cookie Check:", cookies.email);
        
        if (cookies.email) {
          try {
            const db_info = await getAccountInfo("customer", cookies.email);
            console.log("DB Response:", db_info);

            if (db_info.success) {
              const info = db_info.info;
              setCustomerData({
                fName: info.first_name,
                lName: info.last_name,
                dob: new Date(JSON.stringify(info.dob)),
                date_reg: new Date(JSON.stringify(info.date_registered)),
                email: info.email
              });
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
            <p>
              <strong>Next Event:</strong> Summer Lights Festival
            </p>
            <p>
              <strong>Date:</strong> August 17, 2026
            </p>
            <p>
              <strong>Location:</strong> Newark, NJ
            </p>
            <p>
              <strong>Status:</strong> Ticket Confirmed
            </p>

            <div className="account-card-actions">
              <Link href="/events" className="account-primary-btn">
                View Events
              </Link>
            </div>
          </div>

          <div className="account-card">
            <h2>Saved Preferences</h2>
            <p>
              <strong>Favorite Genre:</strong> {customer.genre || "Not Added"}
            </p>
            <p>
              <strong>Favorite Artist:</strong> {customer.artist || "Not Added"}
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