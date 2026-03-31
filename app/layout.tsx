import type { Metadata } from "next";
import { cookies } from "next/headers";
import { showLogin, hideLogin } from "./scripts/headerScripts";
import "../styles/main.css";
import "../styles/signup.css";

async function LoginBar() {
  const cookieStore = await cookies();
  const hasUsername = cookieStore.has("username");

  const accButton = <button className='headerButton'><a href='/account'>Account</a></button>;
  const loginButtons = <div id="login-container">
                          <div id="input-group">
                            <div className="label_group">
                              <label htmlFor="username-input">Username*</label>
                              <input type="text" id="username-input" required />
                            </div>
                            
                            <div className="label_group">
                              <label htmlFor="password-input">Password*</label>
                              <input type="password" id="password-input" required />
                            </div>

                            <button className='headerButton' id='loginButton' onClick={showLogin}>Login</button>
                            <button className='headerButton' id='signupButton' onClick={hideLogin}><a href='/signup'>Sign Up</a></button>
                          </div>

                          <div id="required-note">* Indicates required field</div>
                       </div>;
                       
  return hasUsername ? accButton : loginButtons;
}

export const metadata: Metadata = {
  title: "LiveLink Events",
  description: "Purchase tickets with ease and confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* below code allows for custom fonts from Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis:YEAR@1979&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        {/* Header here for consistency between pages */}
        <header>
          <span>
              {/*<h2><a href="/"><i>LiveLink Events</i></a></h2>*/}
          </span>
          <span>
              {/*{LoginBar()}*/}
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
