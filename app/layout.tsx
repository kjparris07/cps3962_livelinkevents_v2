import type { Metadata } from "next";
import { cookies } from "next/headers";
import "../styles/main.css";
import "../styles/signup.css";
import "../styles/membership.css";
import "../styles/signin.css";

async function LoginBar() {
  const cookieStore = await cookies();
  const hasUsername = cookieStore.has("username");

  return (
    <button id="headerButton">
      <a href={hasUsername ? "/account" : "/login"}>
        {hasUsername ? "Account" : "Sign Up / Log In"}
      </a>
    </button>
  );
}

export const metadata: Metadata = {
  title: "LiveLink Events",
  description: "Purchase tickets with ease and confidence.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header>
          <span>
            <h2>
              <a href="/">
                <i>LiveLink Events</i>
              </a>
            </h2>
          </span>
          <span>
            {await LoginBar()}
          </span>
        </header>

        {children}
      </body>
    </html>
  );
}