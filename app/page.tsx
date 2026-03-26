import Head from "next/head";
import { BigButton } from "./globalComponents/BigButton";
import "../styles/main.css";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="../styles/main.css" />
      </Head>
      <div>
        
        <main>
          <h1 id="tagline">YOUR NEXT CONCERT EXPERIENCE<br />STARTS HERE...</h1>

          <h2 id="search">Search by:</h2>
          <div className="container">
              <div>
                  <label htmlFor="location"><h3>Location</h3></label>
                  <input className="homeInput" type="text" name="location" placeholder="Enter City or Zipcode" />
                  <button className="babyButton"><a href="/events">&gt;</a></button>
              </div>
              <div>
                  <label htmlFor="date"><h3>Date</h3></label>
                  <input className="homeInput" type="date" name="date" />
                  <button className="babyButton"><a href="/events">&gt;</a></button>
              </div>
              <div>
                  <label htmlFor="artist"><h3>Artist</h3></label>
                  <input className="homeInput" type="text" name="artist" placeholder="Artist" />
                  <button className="babyButton"><a href="/events">&gt;</a></button>
              </div>
          </div>
          <BigButton
            content={"View All Events"}
            link={"/events"}
          />
          <BigButton
            content={"Become a member today and don't miss on discounts!"}
            link={"/membership"}
          />
          
        </main>
      </div>
    </>
  );
}
