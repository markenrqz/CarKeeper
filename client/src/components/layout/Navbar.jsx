import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* CarKeeper logo / home link */}
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
          CarKeeper
        </Link>

        {user ? (
          // Navigation shown to logged-in users
          <nav className="navbar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/garage"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Garage
            </NavLink>

            <NavLink
              to="/vehicles/add"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              + Add Vehicle
            </NavLink>
          </nav>
        ) : (
          // Navigation shown to visitors
          <nav className="navbar-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Register
            </NavLink>
          </nav>
        )}

        {/* User menu shown only when logged in */}
        {user && (
          <div className="navbar-user">
            <span>{user.name?.split(" ")[0]}</span>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
