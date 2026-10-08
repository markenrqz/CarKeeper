import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Garage from "./pages/Garage";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import VehicleDetails from "./pages/VehicleDetails";
import ServiceHistory from "./pages/ServiceHistory";
import SharedVehicleHistory from "./pages/SharedVehicleHistory";

function App() {
  return (
    <Routes>
      {/* =========================
          Public Routes
          ========================= */}

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Public read-only service history.
          No ProtectedRoute is used because someone
          with a valid share link should be able to
          view it without a CarKeeper account. */}
      <Route path="/shared/:shareToken" element={<SharedVehicleHistory />} />

      {/* =========================
          Protected Routes
          ========================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/garage"
        element={
          <ProtectedRoute>
            <Garage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/add"
        element={
          <ProtectedRoute>
            <AddVehicle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:id/edit"
        element={
          <ProtectedRoute>
            <EditVehicle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:id/services"
        element={
          <ProtectedRoute>
            <ServiceHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:id"
        element={
          <ProtectedRoute>
            <VehicleDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
