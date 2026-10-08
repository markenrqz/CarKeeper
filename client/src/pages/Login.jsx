import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Store the email and password entered by the user
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Update formData whenever the user types
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Send the login details to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);

      // Successful login takes the user to My Garage
      navigate("/garage");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to log in");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card card">
        <div className="auth-heading">
          <p className="auth-eyebrow">Welcome</p>
          <h1>Log in to CarKeeper</h1>
          <p>
            Access your vehicles, service history and upcoming maintenance
            information.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary auth-submit">
            Log In
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
