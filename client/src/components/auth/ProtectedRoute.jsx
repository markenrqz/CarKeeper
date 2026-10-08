import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If there is no logged-in user, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise display the protected page
  return children;
}

export default ProtectedRoute;
