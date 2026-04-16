"use client";

import "@/styles/membershipPages.css";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { membershipPlans} from "@/lib/memberships";

export default function EliteMembershipPage() {
  const router = useRouter();
  const [ cookies ] = useCookies();
  const [ mounted, setMounted ] = useState(false);
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
    
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLoggedIn = mounted ? cookies.email : null;
  
  if (!isLoggedIn) {
    router.push("/login?plan=elite");
    return null;
  }

  

  return (
    <main className="membership-checkout-page">
      <form onSubmit={e => {
        e.preventDefault();
        setTimeout(() => {
          router.push("/membership/confirmation?plan=elite");
        }, 800);
      }}>
          <div className="membership-title">Elite Membership Payment ($19.99) </div>
          <div className="membership-required-note">* Indicates required field</div>

          <div className="membership-container">
            <div className="input-group">
              <div className="input-label">Name on Card*</div>
              <input type="text" className="input-box" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required/>
            </div>

            <div className="input-group">
              <div className="input-label">Card Number*</div>
              <input type="text" className="input-box" placeholder="1234..." value={card} onChange={(e) => setCard(e.target.value)} required/>
            </div>

            <div className="input-group">
              <div className="input-label">Expiration date*</div>
              <input type="text" className="input-box" placeholder="MM/YY" maxLength={5} value={expiry} onChange={(e) => { let val = e.target.value;

                  // Auto‑format MM/YY
                  if (val.length === 2 && expiry.length === 1) {
                    val = val + "/";
                  }

                  val = val.replace(/[^0-9/]/g, "");
                  setExpiry(val);
                }}
                required/>
            </div>

            <div className="input-group">
              <div className="input-label">Security code*</div>
              <input type="password" className="input-box" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)}
                required/>
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