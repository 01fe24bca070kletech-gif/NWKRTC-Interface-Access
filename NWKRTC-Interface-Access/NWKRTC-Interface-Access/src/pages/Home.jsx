import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import BusIllustration from "../components/BusIllustration.jsx";
import SearchForm from "../components/SearchForm.jsx";
import RouteCard from "../components/RouteCard.jsx";
import { popularRoutes } from "../data/busData.js";

function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Opens the Search page with the chosen places
  function handleSearch() {
    if (from && to) {
      navigate(`/search?from=${from}&to=${to}`);
    } else {
      navigate("/search");
    }
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Your City Bus. One Smart Journey.</h1>
            <p>Find your bus easily between Hubballi and Dharwad.</p>
            <Link to="/search" className="btn btn-orange btn-large">
              <Search size={22} /> Search Buses
            </Link>
          </div>
          <div className="hero-image">
            <BusIllustration />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Quick bus search</h2>
          <div className="card">
            <SearchForm
              from={from}
              to={to}
              setFrom={setFrom}
              setTo={setTo}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular routes</h2>
          <div className="card-grid">
            {popularRoutes.slice(0, 3).map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
