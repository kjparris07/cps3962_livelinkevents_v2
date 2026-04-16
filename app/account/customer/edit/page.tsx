"use client";

import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getAccountInfo } from "@/app/actions";
import { setCustomer } from "@/app/actions";
import { CustomerDBInfo } from "@/app/globalComponents/CustomerDBInfo";
import EditForm from "@/app/globalComponents/EditForm";

import "@/styles/main.css";
import "@/styles/account.css";
import "@/styles/signin.css";

export default function EditCustomer() {
  const [ cookies ] = useCookies(["email"]);
  const [ customer, setCustomerData ] = useState<CustomerDBInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (cookies.email) {
        const db_info = await getAccountInfo("customer", cookies.email);
        if (db_info.success) {
          setCustomerData(await setCustomer(db_info.info));
        }
      }
    };
    fetchInfo();
  }, [cookies.email]);

  if (!customer) return <div>Loading...</div>;
  return <EditForm customer={customer} />;
}