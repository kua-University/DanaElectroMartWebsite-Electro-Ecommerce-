const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Dana ElectroMart backend running 🚀");
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working correctly",
  });
});

// Example environment check (safe debug)
app.get("/api/env", (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV || "not set",
    port: process.env.PORT || 5000,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error handler (prevents crash)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});