import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

import infoPng from "../../assets/question.png";
import Confirmation from "./Confirmation.jsx";

import "./FormArea.css";

function FormArea({ supabase }) {
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
      console.log("Data:");
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function onLocationSubmit(e) {
    e.preventDefault();
    const city = e.target[0].value;
    const region = e.target[1].value;
    const country = e.target[2].value;

    const locations = await getGeocodingData(city, region, country);

    if (locations) {
      setSubmissionData((prevData) => ({
        ...prevData,
        location: locations,
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

  async function onSubmissionConfirm(updatedData = submissionData) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { name, location, longitude, latitude } = updatedData;
    const { data, error } = await supabase.from("locations").insert([
      {
        name,
        location,
        longitude,
        latitude,
        date: formattedDate,
      },
    ]);

    if (error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.log(data);
      setSubmissionData({
        name: "",
        location: "",
        date: "",
        longitude: "",
        latitude: "",
        confirmed: "no",
      });
    }
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
              <input
                type="text"
                minLength={1}
                maxLength={50}
                placeholder="San Francisco"
                required
              />
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

              <input
                type="text"
                minLength={1}
                maxLength={50}
                placeholder="California"
              />
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="region">Country</label>
            <input
              type="text"
              minLength={1}
              maxLength={50}
              placeholder="United States"
              required
            />
          </div>
          <button>Submit</button>
        </form>
      )}
      {submissionData.confirmed === "ask" && (
        <div className="confirmation-container">
          <div className="confirmations">
            {submissionData.location.length > 0 ? (
              submissionData.location.map((location) => (
                <Confirmation
                  key={location.name + location.state + location.country}
                  location={location}
                  confirmSubmission={onSubmissionConfirm}
                  setSubmissionData={setSubmissionData}
                  getSubmissionData={() => submissionData} // Pass a function to fetch the latest state
                />
              ))
            ) : (
              <p>No locations found.</p>
            )}
          </div>
          <button className="decline-btn" onClick={onSubmissionDecline}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

export default FormArea;
