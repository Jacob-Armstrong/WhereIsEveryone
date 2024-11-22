import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import Header from "./components/header/Header.jsx";
import Map from "./components/map/Map.jsx";
import FormArea from "./components/formarea/FormArea.jsx";

import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  const supabaseURL = import.meta.env.VITE_DATABASE_URL;
  const supabaseKey = import.meta.env.VITE_DATABASE_KEY;
  const supabase = createClient(supabaseURL, supabaseKey);

  // Listen for changes in the "locations" table (insert events)
  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        () => getLocations() // Fetch new locations when there's an insert
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  });

  async function getLocations() {
    const { data, error } = await supabase.from("locations").select();
    if (error) {
      console.error("Error fetching locations:", error);
      return;
    }

    console.log(data);

    // Only update state if the data is different from the current cities
    setCities((prevCities) => {
      // Check if the new data is different from the existing data
      if (JSON.stringify(prevCities) !== JSON.stringify(data)) {
        return data; // Update only if new data
      }
      return prevCities; // No update if the data is the same
    });
  }

  // Initial fetch of locations
  useEffect(() => {
    getLocations();
  }, []);

  return (
    <div className="main">
      <Header />
      <Map cities={cities} />
      <FormArea supabase={supabase} />
    </div>
  );
}

export default App;
