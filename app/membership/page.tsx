import "../../styles/main.css";
import "../../styles/membership.css";
import { BigButton } from "../globalComponents/BigButton";

export default function Home() {
  return (
    <main>
      <div className="page">
        <div className="hero-text">
          <h1>UPGRADE YOUR EXPERIENCE AND<br/>BECOME A MEMBER TODAY!</h1>
        </div>
        <div className="white-background"> 
          <div className="subtitle">Members enjoy:</div>  
          <ul className="benefits">
            <li>Higher-quality seats that offer closeness to the stage, a better view, and extra comfort.</li>
            <li>Early notifications.</li>
            <li>Enhanced alerts, including price drop.</li>
            <li>Exclusive deals on tickets and artist merchandise.</li>
            <li>Priority access to tickets for high-demand events. </li>
            <li>Exclusive access to members-only events, such as pre-sales, meet-and-greets, and special performances.</li>
            <li>Early access to tickets before general sale starts.</li>
          </ul>
        </div>
        <BigButton
          content={"Become a member!"}
          link={"/payment"}
        />
      </div>
    </main>
  );
}