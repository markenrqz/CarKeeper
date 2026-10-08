import { useState } from "react";

import {
  disableVehicleSharing,
  enableVehicleSharing,
} from "../../services/shareService";

function ShareServiceModal({ vehicle, onClose, onShareChange }) {
  // Start with the vehicle's current sharing state.
  const [shareToken, setShareToken] = useState(vehicle.shareToken || null);

  const [sharingLoading, setSharingLoading] = useState(false);

  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  // Build the public frontend URL from the token.
  const shareUrl = shareToken
    ? `${window.location.origin}/shared/${shareToken}`
    : "";

  // Turn public sharing ON.
  const handleEnableSharing = async () => {
    setSharingLoading(true);
    setError("");
    setCopyMessage("");

    try {
      const response = await enableVehicleSharing(vehicle._id);

      const newShareToken = response.data.shareToken;

      // Update the modal.
      setShareToken(newShareToken);

      // Also update ServiceHistory so the new
      // sharing state is remembered after closing.
      onShareChange(newShareToken);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to enable sharing");
    } finally {
      setSharingLoading(false);
    }
  };

  // Turn public sharing OFF.
  const handleDisableSharing = async () => {
    setSharingLoading(true);
    setError("");
    setCopyMessage("");

    try {
      await disableVehicleSharing(vehicle._id);

      // Update the modal.
      setShareToken(null);

      // Also update ServiceHistory so reopening
      // the modal still shows sharing as OFF.
      onShareChange(null);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to disable sharing");
    } finally {
      setSharingLoading(false);
    }
  };

  // Use one toggle for both enabling
  // and disabling public sharing.
  const handleSharingToggle = async () => {
    if (sharingLoading) {
      return;
    }

    if (shareToken) {
      await handleDisableSharing();
    } else {
      await handleEnableSharing();
    }
  };

  // Copy the public link to the clipboard.
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopyMessage("Link copied!");
    } catch (error) {
      setCopyMessage("Unable to copy the link automatically.");
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        // Close only when the background
        // itself is clicked.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal share-service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="share-modal-title">Share Service History</h2>

            <p>
              {vehicle.year} {vehicle.make} {vehicle.model} •{" "}
              {vehicle.registration}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close share service history"
          >
            ×
          </button>
        </div>

        <div className="share-status-row">
          <div>
            <h3>Public Sharing</h3>

            <p>
              Allow someone with the link to view this vehicle&apos;s service
              history.
            </p>
          </div>

          <button
            type="button"
            className={`share-toggle ${
              shareToken ? "share-toggle-on" : "share-toggle-off"
            }`}
            role="switch"
            aria-checked={Boolean(shareToken)}
            aria-label="Public service history sharing"
            onClick={handleSharingToggle}
            disabled={sharingLoading}
          >
            <span className="share-toggle-text">
              {sharingLoading ? "..." : shareToken ? "ON" : "OFF"}
            </span>

            <span className="share-toggle-track">
              <span className="share-toggle-thumb" />
            </span>
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {!shareToken ? (
          <div className="share-disabled">
            <p>
              Sharing is currently disabled. Turn the toggle on to create a
              read-only public link.
            </p>
          </div>
        ) : (
          <div className="share-enabled">
            <div className="share-link-group">
              <label htmlFor="shareLink">Share Link</label>

              <div className="share-link-row">
                <input id="shareLink" type="text" value={shareUrl} readOnly />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCopyLink}
                >
                  Copy
                </button>
              </div>

              {copyMessage && <p className="copy-message">{copyMessage}</p>}
            </div>

            <div className="share-information">
              <strong>Read-only access</strong>

              <p>
                Anyone with this link can view the vehicle information and
                service history. They cannot edit or delete any records.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareServiceModal;
