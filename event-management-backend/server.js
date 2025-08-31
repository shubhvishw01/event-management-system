const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For serving uploaded files
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes"); // ya events.js jo aapne banaya
const userRoutes = require("./routes/userRoutes");

app.use("/api", authRoutes);         // Login / Auth routes
app.use("/api/events", eventRoutes); // Event routes
app.use("/api/users", userRoutes);   // User routes

// ===== Server start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
