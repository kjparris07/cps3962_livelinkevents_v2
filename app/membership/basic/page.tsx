"use client";

import "@/styles/membershipPages.css";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { membershipPlans} from "@/lib/memberships";

export default function BasicMembershipPage() {
  const router = useRouter();
  const [ cookies ] = useCookies();
  const [ mounted, setMounted ] = useState(false);
  
  // Simulated login check
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLoggedIn = mounted ? cookies.email : null;
  
  if (!isLoggedIn) {
    router.push("/login?plan=basic");
    return null;
  }
  
  const plan = membershipPlans.basic;
  const [name, setName] = useState("");


  return (
    <main className="membership-checkout-page">
      <form onSubmit={e => {
        e.preventDefault();
        setTimeout(() => {
          router.push("/membership/confirmation?plan=basic");
        }, 800);
      }}>
      <div className="membership-title">Basic Free Membership ($0.00) </div>
      <div className="membership-required-note">Free Forever!</div>
    
        <div className="membership-container">
        <div className="input-group">
              <div className="input-label">Full Name*</div>
              <input type="text" className="input-box" value={name} onChange={(e) => setName(e.target.value)} required/>
            </div>
            </div>

        <div className="cta">
        <button className="cta-btn" type="submit">
          Continue
        </button>
        </div>
      </form>
    </main>
  );
}