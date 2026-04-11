'use client'

import { CookiesProvider } from "react-cookie";

export default function ClientProviders({children}:any) {
    return (
        <CookiesProvider>
          {children}
        </CookiesProvider>
    );
}