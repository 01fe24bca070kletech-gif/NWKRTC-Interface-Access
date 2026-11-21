import RouteCard from "../components/RouteCard.jsx";
import { popularRoutes } from "../data/busData.js";

function RoutesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Routes</h1>
        <p className="page-subtitle">Main bus routes in Hubballi and Dharwad.</p>

        <div className="card-grid">
          {popularRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoutesPage;
