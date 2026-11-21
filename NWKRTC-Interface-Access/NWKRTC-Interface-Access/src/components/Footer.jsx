import { Bus } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-name">
          <Bus size={20} /> NWKRTC BusTrack
        </span>
        <span>BCA Academic Project • Sample data only</span>
      </div>
    </footer>
  );
}

export default Footer;
