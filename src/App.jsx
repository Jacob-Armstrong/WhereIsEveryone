import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

import Header from "./components/header/Header.jsx";
import Map from "./components/map/Map.jsx";

import "./App.css";

const supabaseURL = import.meta.env.VITE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_DATABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey);

function App() {
  const [cities, setCities] = useState([]);
  // async function getLocations() {
  //   const { data } = await supabase.from("locations").select();
  //   console.log(data);
  // }

  // async function insertLocation() {
  //   const { error } = await supabase.from("locations").insert({
  //     checkin_data: {
  //       name: "Emma",
  //       city: "San Clemente, CA",
  //       longitude: 172.123901,
  //       latitude: -42.1239018,
  //     },
  //   });

  //   if (error) {
  //     console.log(`Error: ${error.message}`);
  //   }
  // }

  return (
    <div className="main">
      <Header />
      <Map cities={cities} handleCities={setCities} />
      {/* <FormArea /> */}
    </div>
  );
}

export default App;
