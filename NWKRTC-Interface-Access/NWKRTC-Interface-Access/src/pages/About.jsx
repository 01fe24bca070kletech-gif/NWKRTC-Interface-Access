import { Search, Clock, MapPin } from "lucide-react";

function About() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1 className="page-title">About NWKRTC BusTrack</h1>
        <p className="page-subtitle">
          A simple way to find city buses between Hubballi and Dharwad.
        </p>

        <div className="card">
          <p>
            NWKRTC BusTrack helps passengers find a bus quickly. Choose where you are
            starting and where you want to go, and the website shows the buses, their
            timings and the stops on the way.
          </p>
          <p>
            This is a BCA second-year academic project. It uses sample bus data and does
            not show live bus locations.
          </p>
        </div>

        <div className="card-grid three">
          <div className="info-card">
            <MapPin size={30} />
            <h3>Choose your places</h3>
            <p>Select FROM and TO.</p>
          </div>
          <div className="info-card">
            <Search size={30} />
            <h3>Search</h3>
            <p>Click Search Buses.</p>
          </div>
          <div className="info-card">
            <Clock size={30} />
            <h3>See bus details</h3>
            <p>Check times and stops.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
