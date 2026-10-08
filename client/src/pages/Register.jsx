import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Store the values entered into the registration form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Update formData whenever the user types into an input
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Submit the registration form to the backend API
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(formData.name, formData.email, formData.password);

      // After successful registration, send the user to login
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card card">
        <div className="auth-heading">
          <p className="auth-eyebrow">Get started</p>
          <h1>Create your CarKeeper account</h1>
          <p>
            Create an account to manage your vehicles and keep maintenance
            records organised.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
            <span className="auth-field-help">Use at least 6 characters.</span>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary auth-submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
