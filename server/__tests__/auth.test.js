// Load environment variables from the .env file.
require("dotenv").config({ quiet: true });

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const ServiceRecord = require("../models/ServiceRecord");

// Test account used only in the carkeeper_test database.
const testUser = {
  name: "CarKeeper Test User",
  email: "carkeeper-test@example.com",
  password: "password123",
};

// Test vehicle used for the CRUD tests.
const testVehicle = {
  make: "Toyota",
  model: "Corolla",
  year: 2015,
  registration: "TEST123",
  transmission: "Automatic",
  mileage: 85000,
  wofExpiry: "2027-01-15",
  registrationExpiry: "2027-02-20",
  nextServiceMileage: 90000,
  notes: "For automated test",
};

// Test service record used for the service history tests.
const testServiceRecord = {
  serviceType: "Oil Change",
  date: "2026-10-01",
  mileage: 87000,
  cost: 180,
  workshop: "CarKeeper Test Workshop",
  notes: "Service record created by automated test",
};

// Store values that later tests need.
let authToken;
let vehicleId;
let serviceRecordId;
let shareToken;

// Connect to the separate test database before running the tests.
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  // Remove old test data in case a previous test run
  // stopped before cleanup was completed.
  const existingTestUser = await User.findOne({
    email: testUser.email,
  });

  if (existingTestUser) {
    const existingVehicles = await Vehicle.find({
      owner: existingTestUser._id,
    });

    const existingVehicleIds = existingVehicles.map((vehicle) => vehicle._id);

    // Remove service records linked to previous test vehicles.
    if (existingVehicleIds.length > 0) {
      await ServiceRecord.deleteMany({
        vehicle: {
          $in: existingVehicleIds,
        },
      });
    }

    await Vehicle.deleteMany({
      owner: existingTestUser._id,
    });

    await User.deleteOne({
      _id: existingTestUser._id,
    });
  }
});

// Remove test data and close the database connection
// after all tests have finished.
afterAll(async () => {
  const existingTestUser = await User.findOne({
    email: testUser.email,
  });

  if (existingTestUser) {
    const existingVehicles = await Vehicle.find({
      owner: existingTestUser._id,
    });

    const existingVehicleIds = existingVehicles.map((vehicle) => vehicle._id);

    if (existingVehicleIds.length > 0) {
      await ServiceRecord.deleteMany({
        vehicle: {
          $in: existingVehicleIds,
        },
      });
    }

    await Vehicle.deleteMany({
      owner: existingTestUser._id,
    });

    await User.deleteOne({
      _id: existingTestUser._id,
    });
  }

  await mongoose.connection.close();
});

describe("CarKeeper API", () => {
  test("GET / returns the API running message", () => {
    return request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          message: "CarKeeper API is running",
        });
      });
  });
});

describe("Authentication API", () => {
  test("POST /api/auth/register registers a new user", () => {
    return request(app)
      .post("/api/auth/register")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe("User registered successfully");

        expect(response.body.user.name).toBe(testUser.name);

        expect(response.body.user.email).toBe(testUser.email);

        // The API must not return the user's password.
        expect(response.body.user.password).toBeUndefined();
      });
  });

  test("POST /api/auth/register rejects a duplicate email", () => {
    return request(app)
      .post("/api/auth/register")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "A user with this email already exists"
        );
      });
  });

  test("POST /api/auth/login logs in with valid credentials", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Login successful");

        // Save the JWT so protected tests can use it.
        authToken = response.body.token;

        expect(authToken).toBeDefined();

        expect(response.body.user.email).toBe(testUser.email);
      });
  });

  test("POST /api/auth/login rejects an incorrect password", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      })
      .expect("Content-Type", /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.message).toBe("Invalid email or password");
      });
  });

  test("GET /api/vehicles rejects a request without a token", () => {
    return request(app)
      .get("/api/vehicles")
      .expect("Content-Type", /json/)
      .expect(401);
  });
});

describe("Vehicle API", () => {
  test("POST /api/vehicles creates a vehicle", () => {
    return request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${authToken}`)
      .field("make", testVehicle.make)
      .field("model", testVehicle.model)
      .field("year", testVehicle.year)
      .field("registration", testVehicle.registration)
      .field("transmission", testVehicle.transmission)
      .field("mileage", testVehicle.mileage)
      .field("wofExpiry", testVehicle.wofExpiry)
      .field("registrationExpiry", testVehicle.registrationExpiry)
      .field("nextServiceMileage", testVehicle.nextServiceMileage)
      .field("notes", testVehicle.notes)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe("Vehicle added successfully");

        expect(response.body.vehicle.make).toBe(testVehicle.make);

        expect(response.body.vehicle.model).toBe(testVehicle.model);

        expect(response.body.vehicle.registration).toBe(
          testVehicle.registration
        );

        // Save the vehicle ID for later tests.
        vehicleId = response.body.vehicle._id;

        expect(vehicleId).toBeDefined();
      });
  });

  test("GET /api/vehicles returns the user's vehicles", () => {
    return request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);

        expect(response.body.length).toBeGreaterThan(0);

        const vehicle = response.body.find((item) => item._id === vehicleId);

        expect(vehicle).toBeDefined();

        expect(vehicle.registration).toBe(testVehicle.registration);
      });
  });

  test("GET /api/vehicles/:id returns one vehicle", () => {
    return request(app)
      .get(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toBe(vehicleId);

        expect(response.body.make).toBe(testVehicle.make);

        expect(response.body.model).toBe(testVehicle.model);
      });
  });

  test("PUT /api/vehicles/:id updates a vehicle", () => {
    return request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .field("mileage", 87500)
      .field("notes", "Vehicle updated by automated test")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Vehicle updated successfully");

        expect(response.body.vehicle.mileage).toBe(87500);

        expect(response.body.vehicle.notes).toBe(
          "Vehicle updated by automated test"
        );
      });
  });
});

describe("Service Record API", () => {
  test("POST /api/vehicles/:vehicleId/services creates a service record", () => {
    return request(app)
      .post(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(testServiceRecord)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe("Service record added successfully");

        expect(response.body.serviceRecord.serviceType).toBe(
          testServiceRecord.serviceType
        );

        expect(response.body.serviceRecord.mileage).toBe(
          testServiceRecord.mileage
        );

        serviceRecordId = response.body.serviceRecord._id;

        expect(serviceRecordId).toBeDefined();
      });
  });

  test("GET /api/vehicles/:vehicleId/services returns service records", () => {
    return request(app)
      .get(`/api/vehicles/${vehicleId}/services`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);

        const serviceRecord = response.body.find(
          (item) => item._id === serviceRecordId
        );

        expect(serviceRecord).toBeDefined();

        expect(serviceRecord.serviceType).toBe(testServiceRecord.serviceType);
      });
  });

  test("PUT /api/services/:id updates a service record", () => {
    return request(app)
      .put(`/api/services/${serviceRecordId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        cost: 220,
        notes: "Service record updated by automated test",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe(
          "Service record updated successfully"
        );

        expect(response.body.serviceRecord.cost).toBe(220);

        expect(response.body.serviceRecord.notes).toBe(
          "Service record updated by automated test"
        );
      });
  });

  test("DELETE /api/services/:id deletes a service record", () => {
    return request(app)
      .delete(`/api/services/${serviceRecordId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe(
          "Service record deleted successfully"
        );
      });
  });
});

describe("Service History Sharing API", () => {
  test("POST /api/vehicles/:id/share enables sharing", () => {
    return request(app)
      .post(`/api/vehicles/${vehicleId}/share`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Service history sharing enabled");

        shareToken = response.body.shareToken;

        expect(shareToken).toBeDefined();
        expect(typeof shareToken).toBe("string");
      });
  });

  test("GET /api/public/vehicles/:shareToken returns shared history without authentication", () => {
    return (
      request(app)
        .get(`/api/public/vehicles/${shareToken}`)
        // Notice that no Authorization header is used.
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.vehicle).toBeDefined();

          expect(response.body.vehicle.registration).toBe(
            testVehicle.registration
          );

          expect(Array.isArray(response.body.serviceRecords)).toBe(true);

          // Owner account information must not be
          // exposed through the public endpoint.
          expect(response.body.vehicle.owner).toBeUndefined();
        })
    );
  });

  test("DELETE /api/vehicles/:id/share disables sharing", () => {
    return request(app)
      .delete(`/api/vehicles/${vehicleId}/share`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Service history sharing disabled");
      });
  });

  test("GET /api/public/vehicles/:shareToken rejects the old token after sharing is disabled", () => {
    return request(app)
      .get(`/api/public/vehicles/${shareToken}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "Shared vehicle history not found or sharing has been disabled"
        );
      });
  });
});

describe("Vehicle Cleanup", () => {
  test("DELETE /api/vehicles/:id deletes the vehicle", () => {
    return request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Vehicle deleted successfully");
      });
  });
});
