function ServiceRecordForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  error,
  submitLabel = "Save Service Record",
}) {
  return (
    <form className="service-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="serviceType">Service Type</label>

        <input
          id="serviceType"
          name="serviceType"
          type="text"
          placeholder="e.g. Oil and Filter Service"
          value={formData.serviceType}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="serviceDate">Service Date</label>

          <input
            id="serviceDate"
            name="date"
            type="date"
            value={formData.date}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceMileage">Odometer (km)</label>

          <input
            id="serviceMileage"
            name="mileage"
            type="number"
            min="0"
            placeholder="e.g. 86000"
            value={formData.mileage}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="serviceCost">Cost ($)</label>

          <input
            id="serviceCost"
            name="cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 179.95"
            value={formData.cost}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceWorkshop">Workshop</label>

          <input
            id="serviceWorkshop"
            name="workshop"
            type="text"
            placeholder="e.g. AA Service Centre"
            value={formData.workshop}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="serviceNotes">Notes</label>

        <textarea
          id="serviceNotes"
          name="notes"
          rows="4"
          placeholder="Add any additional service details..."
          value={formData.notes}
          onChange={onChange}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ServiceRecordForm;
