import { useState, useEffect } from "react";

import Header from "./components/header/Header.jsx";
import Map from "./components/map/Map.jsx";
import FormArea from "./components/formarea/FormArea.jsx";

import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  // Fetch locations from our serverless API (Neon)
  async function getLocations() {
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) {
        console.error("Error fetching locations:", await res.text());
        return;
      }
      const data = await res.json();
      // Normalize numeric fields (pg returns NUMERIC as strings)
      const normalized = data.map((r) => ({
        ...r,
        latitude: r.latitude !== null && r.latitude !== undefined ? Number(r.latitude) : r.latitude,
        longitude: r.longitude !== null && r.longitude !== undefined ? Number(r.longitude) : r.longitude,
      }));

      setCities((prevCities) => {
        if (JSON.stringify(prevCities) !== JSON.stringify(normalized)) {
          return normalized;
        }
        return prevCities;
      });
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  }

  // Initial fetch and polling (replace Supabase realtime)
  useEffect(() => {
    getLocations();
    const interval = setInterval(getLocations, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main">
      <Header />
      <Map cities={cities} />
      <FormArea />
    </div>
  );
}

export default App;
