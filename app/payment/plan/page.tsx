/* PAYMENT PAGE */
"use client"

import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { use } from 'react'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { getAccountInfo, updateAccount } from "@/app/actions";
import { membershipPlans } from "@/lib/memberships";

type PaymentData = {
  name: string;
  email: string;
  expiration_month: number;
  expiration_year: number;
  security_code: number;
}

export default function PlanPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>
}) {
  const params = use(searchParams);
  const [cookies] = useCookies();
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [oldPlan, setOldPlan] = useState("");
  const { register, handleSubmit } = useForm<PaymentData>();
  const { replace } = useRouter();

  useEffect(() => {
    setMounted(true);
    try {
      checkAcc();
    } catch (error) {
      setMessage(`${error}`);
    }
  }, [cookies.email]);

  const isLoggedIn = mounted ? cookies.email : null;

  const plan = params.plan;

  const checkAcc = async () => {
    const account = (await getAccountInfo("customer", cookies.email));
    if (account.success) {
      setOldPlan(account.info.plan);
    }
  }

  const onSubmit = async () => {
    if (isLoggedIn){
      try {
        const fd = new FormData();
        fd.append("plan", plan?.toString() || "")
        const update = await updateAccount("customer",  cookies.email, fd);
        if (update.success) {
          const paramSet = new URLSearchParams(await searchParams);
          paramSet.set("plan", plan || "");
          replace(`/membership/confirmation?${paramSet.toString()}`);
        } else {
          throw Error(`${update.error}`);
        }
      } catch(error) {
        console.error(error);
      }
    }
  };

  if (plan === "") return (<h1 className="title">Loading...</h1>);

  if(oldPlan === plan?.toString()) {
    return(
      <div className="container">
        <h1>You're already a(n) {plan?.toUpperCase()} member!</h1>
        <Link href="/account/customer" className="cta-btn" style={{width: "fit-content", margin:"20px auto"}}>
          Return to Account
        </Link>
      </div>
    )
  } 

  return (
    <Suspense>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" style={{marginTop: "100px", textAlign:"center"}}>
        <div className="payment-title">PAYMENT for {plan?.toUpperCase()} Membership</div>
        <div className="required-note">* Indicates required field</div>
        <div className="error">{message}</div>
        <div>
          <style>{".input-group {width: 100%;}"}</style>
          <span><em>Total: ${plan === "premium" ? membershipPlans.premium.price : membershipPlans.elite.price}</em></span>
          <div className="input-group">
            <div className="input-label">Name on Card*</div>
            <input placeholder="Jane Doe" type="text" className="input-box" {...register("name")} />
          </div>

          <div className="input-group">
            <div className="input-label">Digits*</div>
            <input 
              placeholder="1234 5678 1234 5678" 
              type="number" 
              minLength={16} 
              maxLength={16} 
              className="input-box"  
              {...register("email")}  
            />
          </div>

          <div className="input-group">
            <div className="input-label">Expiration date*</div>
              <input 
              type="number" 
              min={1} 
              max={12} 
              placeholder="01" 
              className="input-box" 
              {...register("expiration_month")}  
            />
            <input 
              type="number" 
              min={2026} 
              max={9999} 
              placeholder="2028" 
              className="input-box" 
              {...register("expiration_year")}  
            />
          </div>

          <div className="input-group">
            <div className="input-label">Security code*</div>
            <input placeholder="123" type="number" className="input-box"  {...register("security_code")}  />
          </div>
        </div>
        <div className="cta" style={{width:"fit-content", margin:"0 auto"}}>
          <button className="cta-btn">
            Submit
          </button>
        </div>
      </form>
    </Suspense>  
  );
}