import { Link } from "react-router-dom";

function SummaryCard({ title, value, subtitle, icon, to }) {
  // Shared card content so we do not duplicate the markup.
  const cardContent = (
    <>
      <div className="summary-card-icon">{icon}</div>

      <div className="summary-card-content">
        <p className="summary-card-title">{title}</p>

        <strong className="summary-card-value">{value}</strong>

        {subtitle && <p className="summary-card-subtitle">{subtitle}</p>}
      </div>
    </>
  );

  // If a destination is provided, make the card clickable.
  if (to) {
    return (
      <Link to={to} className="summary-card summary-card-link card">
        {cardContent}
      </Link>
    );
  }

  // Otherwise display a normal summary card.
  return <article className="summary-card card">{cardContent}</article>;
}

export default SummaryCard;
