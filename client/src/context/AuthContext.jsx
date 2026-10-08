import { createContext, useContext, useState } from "react";
import api from "../services/api";

// Create the authentication context
const AuthContext = createContext();

// Provider makes authentication data available throughout CarKeeper
export function AuthProvider({ children }) {
  // Restore the user from localStorage when the app loads
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Register a new user
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  };

  // Log in and store the returned JWT and user
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    // Keep the login after the browser refreshes
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return response.data;
  };

  // Remove authentication information when logging out
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook makes the authentication context easier to use
export function useAuth() {
  return useContext(AuthContext);
}