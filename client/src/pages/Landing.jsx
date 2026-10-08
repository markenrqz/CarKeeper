import { Link } from "react-router-dom";

function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <p className="landing-eyebrow">Vehicle management made simple</p>

          <h1>Keep track of your vehicle. All in one place.</h1>

          <p className="landing-hero-text">
            CarKeeper helps you organise vehicle details, service history,
            maintenance costs, WOF and registration information in one
            convenient place.
          </p>

          <div className="landing-actions">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        <div className="landing-hero-card card" aria-hidden="true">
          <div className="landing-car-icon">🚗</div>

          <div className="landing-preview-content">
            <span>Your vehicle information</span>
            <strong>Organised and easy to access</strong>

            <div className="landing-preview-row">
              <span>WOF</span>
              <span>Registration</span>
              <span>Service</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features" aria-labelledby="features-title">
        <div className="landing-section-heading">
          <h2 id="features-title">Everything you need to stay organised</h2>
          <p>
            Keep important vehicle information together and make maintenance
            history easier to manage.
          </p>
        </div>

        <div className="landing-feature-grid">
          <article className="landing-feature-card card">
            <div className="landing-feature-icon" aria-hidden="true">
              🚘
            </div>
            <h3>Vehicle Management</h3>
            <p>
              Keep vehicle details, WOF and registration dates, transmission and
              odometer information together.
            </p>
          </article>

          <article className="landing-feature-card card">
            <div className="landing-feature-icon" aria-hidden="true">
              🔧
            </div>
            <h3>Service History</h3>
            <p>
              Record servicing, repairs, maintenance costs, workshop details and
              notes for each vehicle.
            </p>
          </article>

          <article className="landing-feature-card card">
            <div className="landing-feature-icon" aria-hidden="true">
              🔗
            </div>
            <h3>Share with Buyers</h3>
            <p>
              Create a read-only service-history link when you want to share
              maintenance records with a potential buyer.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Landing;
