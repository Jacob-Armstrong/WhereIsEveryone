import "./FormArea.css";

function Confirmation({
  location,
  getSubmissionData,
  confirmSubmission,
  setSubmissionData,
}) {
  const submittedLocation = `${location.name}, ${
    location.state ? location.state + ", " : ""
  }${location.country}`;

  console.log(`Submitted location: ${submittedLocation}`);
  console.log(`SubmissionData (via function):`);
  console.log(getSubmissionData());

  console.log(`Location:`);
  console.log(location);
  console.log(`coords: ${location.latitude}, ${location.longitude}`);

  function onConfirm() {
    setSubmissionData(() => {
      const updatedData = {
        name: getSubmissionData().name,
        location: submittedLocation,
        latitude: location.latitude,
        longitude: location.longitude,
        confirmed: "yes",
      };

      confirmSubmission(updatedData); // Pass the updated data
      return updatedData; // Ensure state reflects this
    });
  }

  return (
    <div className="confirmation">
      <p className="location-info">{submittedLocation}</p>
      <div className="confirmation-buttons">
        <button className="confirm-btn" onClick={onConfirm}>
          Select
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
