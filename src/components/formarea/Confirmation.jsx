function Confirmation({ location, confirmSubmission }) {
  function onConfirm() {}

  return (
    <div className="confirmation">
      <p className="location-info">{location}</p>
      <div className="confirmation-buttons">
        <button className="confirm-btn" onClick={onConfirm}>
          Select
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
