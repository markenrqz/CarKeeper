import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

import SummaryCard from "../components/dashboard/SummaryCard";
import UpcomingItems from "../components/dashboard/UpcomingItems";
import RecentMaintenance from "../components/dashboard/RecentMaintenance";

import { getVehicles } from "../services/vehicleService";
import { getServiceRecords } from "../services/serviceRecordService";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // First get all vehicles belonging to the
        // currently logged-in user.
        const vehicleResponse = await getVehicles();

        const loadedVehicles = vehicleResponse.data;

        setVehicles(loadedVehicles);

        // Get service history for every vehicle.
        //
        // Promise.all lets these API requests happen
        // together instead of waiting for each one
        // individually.
        const serviceResponses = await Promise.all(
          loadedVehicles.map((vehicle) => getServiceRecords(vehicle._id))
        );

        // Combine all vehicle service histories into
        // one list for the dashboard.
        const allServiceRecords = serviceResponses.flatMap(
          (response, index) => {
            const vehicle = loadedVehicles[index];

            return response.data.map((record) => ({
              ...record,

              // Add vehicle information to each
              // service record for dashboard display.
              vehicleId: vehicle._id,

              vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            }));
          }
        );

        setServiceRecords(allServiceRecords);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =========================
  // Dashboard Calculations
  // =========================

  const now = new Date();

  // Thirty days from today is used to determine
  // whether WOF or registration is coming up soon.
  const thirtyDaysFromNow = new Date();

  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Count WOFs that are expired or due within 30 days.
  const wofDueCount = vehicles.filter((vehicle) => {
    if (!vehicle.wofExpiry) {
      return false;
    }

    return new Date(vehicle.wofExpiry) <= thirtyDaysFromNow;
  }).length;

  // Count vehicles that have reached or passed
  // their next service odometer.
  const serviceDueCount = vehicles.filter((vehicle) => {
    if (!vehicle.nextServiceMileage) {
      return false;
    }

    return Number(vehicle.mileage) >= Number(vehicle.nextServiceMileage);
  }).length;

  // Build the Upcoming Items list.
  const upcomingItems = [];

  vehicles.forEach((vehicle) => {
    const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

    // WOF
    if (vehicle.wofExpiry) {
      const wofDate = new Date(vehicle.wofExpiry);

      if (wofDate <= thirtyDaysFromNow) {
        upcomingItems.push({
          id: `wof-${vehicle._id}`,
          vehicleId: vehicle._id,
          vehicleName,
          title: wofDate < now ? "WOF expired" : "WOF due",
          type: "wof",
          icon: "✓",
          date: vehicle.wofExpiry,
        });
      }
    }

    // Registration
    if (vehicle.registrationExpiry) {
      const registrationDate = new Date(vehicle.registrationExpiry);

      if (registrationDate <= thirtyDaysFromNow) {
        upcomingItems.push({
          id: `rego-${vehicle._id}`,
          vehicleId: vehicle._id,
          vehicleName,
          title:
            registrationDate < now
              ? "Registration expired"
              : "Registration due",
          type: "rego",
          icon: "R",
          date: vehicle.registrationExpiry,
        });
      }
    }

    // Service mileage
    if (vehicle.nextServiceMileage) {
      const currentMileage = Number(vehicle.mileage);

      const nextServiceMileage = Number(vehicle.nextServiceMileage);

      // Show the service when it is due or within
      // the next 1,000 km.
      if (currentMileage >= nextServiceMileage - 1000) {
        upcomingItems.push({
          id: `service-${vehicle._id}`,
          vehicleId: vehicle._id,
          vehicleName,
          title:
            currentMileage >= nextServiceMileage
              ? "Service due"
              : "Service approaching",
          type: "service",
          icon: "🔧",
          value: `${nextServiceMileage.toLocaleString()} km`,
        });
      }
    }
  });

  // Sort date-based upcoming items first.
  upcomingItems.sort((a, b) => {
    if (!a.date && !b.date) {
      return 0;
    }

    if (!a.date) {
      return 1;
    }

    if (!b.date) {
      return -1;
    }

    return new Date(a.date) - new Date(b.date);
  });

  // Sort newest service records first and display
  // only the latest five.
  const recentMaintenance = [...serviceRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <>
      <Navbar />

      <PageContainer className="dashboard-page">
        <div className="dashboard-heading">
          <div>
            <h1>Dashboard</h1>

            <p>An overview of your vehicles and maintenance.</p>
          </div>

          <Link to="/vehicles/add" className="btn btn-primary">
            + Add Vehicle
          </Link>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="garage-message card">
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* =========================
                Summary Cards
                ========================= */}

            <div className="dashboard-summary-grid">
              <SummaryCard
                title="Vehicles"
                value={vehicles.length}
                subtitle="In your garage"
                icon="🚗"
                to="/garage"
              />

              <SummaryCard
                title="WOF Due"
                value={wofDueCount}
                subtitle="Expired or due soon"
                icon="✓"
              />

              <SummaryCard
                title="Service Due"
                value={serviceDueCount}
                subtitle="Based on odometer"
                icon="🔧"
              />
            </div>

            {/* =========================
                Dashboard Content
                ========================= */}

            <div className="dashboard-content-grid">
              <UpcomingItems items={upcomingItems} />

              <RecentMaintenance records={recentMaintenance} />
            </div>
          </>
        )}
      </PageContainer>
    </>
  );
}

export default Dashboard;
