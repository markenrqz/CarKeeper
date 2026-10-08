import ServiceRecordForm from "./ServiceRecordForm";

function ServiceRecordModal({
  vehicle,
  formData,
  onChange,
  onSubmit,
  onClose,
  error,
  title = "Add Service Record",
  submitLabel = "Save Service Record",
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        // Close the modal only when the user clicks
        // the dark background outside the modal.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="service-modal-title">{title}</h2>

            <p>
              {vehicle.year} {vehicle.make} {vehicle.model} •{" "}
              {vehicle.registration}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close service record form"
          >
            ×
          </button>
        </div>

        <ServiceRecordForm
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          error={error}
          submitLabel={submitLabel}
        />
      </div>
    </div>
  );
}

export default ServiceRecordModal;
