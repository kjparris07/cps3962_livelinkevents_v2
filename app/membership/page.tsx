'use client'
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

export default function MembershipPage() {
  const [cookies] = useCookies();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true);
  }, []);
  
    const isLoggedIn = mounted ? cookies.email : null;

  return (
    <main className="membership-page">
      <section className="membership-wrapper">
        <h1 className="membership-title">Join Our Membership</h1>
        <p className="membership-subtitle">
          Welcome to our exclusive membership program. Choose the plan that fits
          your event experience best and enjoy access to special perks, early
          ticket opportunities, and member-only benefits.
        </p>

        <div className="plans-row">
          <div className="plan-card premium-plan">
            <h2>Premium</h2>
            <p className="plan-description">
              Our Premium membership is designed for members who want extra
              value, early access, and priority event updates.
            </p>
            <ul className="plan-features">
              <li>Early access to select tickets</li>
              <li>Member-only discounts</li>
              <li>Priority event updates</li>
              <li>Exclusive promotional offers</li>
            </ul>
            <div className="plan-price">$9.99 / month</div>
            <a href={isLoggedIn ? "/payment/plan?plan=premium" : "/login"} className="plan-button">
              Choose Premium
            </a>
          </div>

          <div className="plan-card elite-plan">
            <h2>Elite</h2>
            <p className="plan-description">
              Elite membership is for users who want the highest level of
              benefits and the most complete LiveLink experience.
            </p>
            <ul className="plan-features">
              <li>Everything in Premium</li>
              <li>Top priority event access</li>
              <li>Exclusive VIP announcements</li>
              <li>Special featured event perks</li>
            </ul>
            <div className="plan-price">$19.99 / month</div>
            <a href={isLoggedIn ? "/payment/plan?plan=elite" : "/login"} className="plan-button">
              Choose Elite
            </a>
          </div>
        </div>

        <div className="divider-line"></div>

        <div className="basic-plan-card">
          <h2>Basic Free Membership</h2>
          <p>
            Our Basic membership gives you access to general site features,
            standard event browsing, and account access at no cost.
          </p>
          <ul className="plan-features basic-features">
            <li>Browse available events</li>
            <li>Create and manage an account</li>
            <li>Receive standard updates</li>
          </ul>
          <a href={isLoggedIn ? "/payment/plan?plan=basic" : "/login"} className="basic-plan-button">
            Join Our Free Membership
          </a>
        </div>
      </section>
    </main>
  );
}