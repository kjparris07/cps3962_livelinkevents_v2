"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getAccountInfo, setOrganizer } from "@/app/actions";
import { OrganizerDBInfo } from "@/app/globalComponents/OrganizerDBInfo";
import EditForm from "./EditForm";
import "@/styles/main.css";
import "@/styles/signin.css";

export default function EditOrganizer() {
  const [ cookies ] = useCookies();
  const [ organizer, setOrganizerData ] = useState<OrganizerDBInfo | null>(null);
  
  useEffect(() => {
    const fetchInfo = async () => {
      if (cookies.email) {
        const db_info = await getAccountInfo("organizer", cookies.email);
        if (db_info.success) {
          setOrganizerData(await setOrganizer(db_info.info));
        }
      }
    };
    fetchInfo();
  }, [cookies.email]);

  if (!organizer) return <div>Loading...</div>;
  return <EditForm organizer={organizer} />;
}