// Format the service date for display.
const formatDate = (date) => {
  if (!date) {
    return "Date not set";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function ServiceRecordCard({ record, onEdit, onDelete }) {
  return (
    <article className="service-record-card card">
      <div className="service-record-main">
        <div className="service-record-date">{formatDate(record.date)}</div>

        <div className="service-record-content">
          <h3>{record.serviceType}</h3>

          <div className="service-record-meta">
            <span>{Number(record.mileage).toLocaleString()} km</span>

            {record.workshop && (
              <>
                <span>•</span>
                <span>{record.workshop}</span>
              </>
            )}
          </div>

          {record.notes && (
            <p className="service-record-notes">{record.notes}</p>
          )}
        </div>

        <div className="service-record-cost">
          ${Number(record.cost || 0).toFixed(2)}
        </div>
      </div>

      <div className="service-record-actions">
        {/* Open the reusable service modal in Edit mode. */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onEdit(record)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(record._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ServiceRecordCard;
