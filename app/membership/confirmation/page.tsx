'use client'
import {use} from 'react';
import { Suspense } from "react";
import { membershipPlans } from "@/lib/memberships";
import Link from "next/link";

export default function MembershipConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const params = use(searchParams);
  const planKey = params.plan as keyof typeof membershipPlans | undefined;
  const plan = planKey ? membershipPlans[planKey] : undefined;

  return (
    <Suspense>
      <main className="membership-confirmation-page" style={{textAlign:"center"}}>
        <section className="confirmation-wrapper">
          <div className="membership-title">{plan?.name} Membership Confirmed</div>

            <p className="membership-required-note">Your membership has been activated.</p>

          <div className="membership-required-note">
          <Link href="/events" className="btn cta-btn">
            Browse Events
          </Link>
          </div>
        </section>
      </main>
    </Suspense>
  );
}