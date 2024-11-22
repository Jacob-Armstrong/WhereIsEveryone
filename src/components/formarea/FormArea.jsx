import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tooltip from "@mui/material/Tooltip";

import infoPng from "../../assets/question.png";

import "./FormArea.css";

function FormArea() {
  // Supabase setup
  const supabaseURL = import.meta.env.VITE_DATABASE_URL;
  const supabaseKey = import.meta.env.VITE_DATABASE_KEY;
  const supabase = createClient(supabaseURL, supabaseKey);

  // Api ninjas setup
  const geocodeURL = "https://api.api-ninjas.com/v1/geocoding";
  const geocodeKey = import.meta.env.VITE_APININJA_API_KEY;

  const [submissionData, setSubmissionData] = useState({
    name: "",
    location: "",
    date: "",
    longitude: "",
    latitude: "",
    confirmed: "no",
  });

  function onNicknameSubmit(e) {
    e.preventDefault();
    const name = e.target[0].value;
    setSubmissionData({ ...submissionData, name });

    console.log(name);
  }

  async function getGeocodingData(location, region, country) {
    const url = `${geocodeURL}?city=${location}, ${region}&country=${country}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Api-Key": geocodeKey,
        },
      });

      const data = await response.json();
      console.log(data[0]);
      return data[0];
    } catch (error) {
      console.log(error);
    }
  }

  async function onLocationSubmit(e) {
    e.preventDefault();
    const city = e.target[0].value;
    const region = e.target[1].value;
    const country = e.target[2].value;

    const location = await getGeocodingData(city, region, country);

    if (location) {
      const submittedLocation = `${location.name || city}, 
      ${location.state ? location.state + ", " : ""}
      ${location.country || country}`;

      console.log(`Submitted location: ${submittedLocation}`);

      setSubmissionData((prevData) => ({
        ...prevData,
        location: submittedLocation,
        longitude: location.longitude || "N/A",
        latitude: location.latitude || "N/A",
        confirmed: "ask",
      }));
    } else {
      console.error("Failed to fetch geocoding data.");
    }
  }

  function onSubmissionDecline() {
    setSubmissionData((prevSubmission) => ({
      ...prevSubmission,
      location: "",
      latitude: "",
      longitude: "",
      confirmed: "no",
    }));
  }

  return (
    <div className="form-area">
      <h3>Add your own location!</h3>
      {submissionData.name === "" && (
        <form className="nickname-form" onSubmit={onNicknameSubmit}>
          <div className="tooltip-div">
            <Tooltip
              title="Or first name, if privacy isn't an issue"
              placement="top"
              arrow
            >
              <img src={infoPng} />
            </Tooltip>
            <label htmlFor="name">Enter your nickname</label>
          </div>
          <input
            type="text"
            minLength={1}
            maxLength={20}
            required
            placeholder="John Smith"
          />
          <button>Submit</button>
        </form>
      )}
      {submissionData.name !== "" && submissionData.location === "" && (
        <form className="location-form" onSubmit={onLocationSubmit}>
          <div className="city-region-div">
            <div className="input-field">
              <div className="tooltip-div">
                <Tooltip
                  title="Or your actual city, if privacy isn't an issue"
                  placement="top"
                  arrow
                >
                  <img src={infoPng} />
                </Tooltip>
                <label htmlFor="location">Nearest major city</label>
              </div>
              <input type="text" minLength={1} maxLength={50} required />
            </div>
            <div className="input-field">
              <div className="tooltip-div">
                <Tooltip
                  title="If you are having trouble getting the right location, try adding a region"
                  placement="top"
                  arrow
                >
                  <img src={infoPng} />
                </Tooltip>
                <label htmlFor="region">State or Region (optional)</label>
              </div>

              <input type="text" minLength={1} maxLength={50} />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="region">Country</label>
            <input type="text" minLength={1} maxLength={50} required />
          </div>
          <button>Submit</button>
        </form>
      )}
      {submissionData.confirmed === "ask" && (
        <div className="confirmation">
          <p className="confirm-ask">Is this the correct location to submit?</p>
          <p className="location-info">{submissionData.location}</p>
          <div className="confirmation-buttons">
            <button className="confirm-btn">Yes</button>
            <button className="decline-btn" onClick={onSubmissionDecline}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormArea;
