console.log("ENV VALUE:", process.env.MONGO_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Schema
const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

// Model
const Location = mongoose.model("Location", locationSchema);

// Route to save location
app.post("/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const newLocation = new Location({
      latitude,
      longitude
    });

    await newLocation.save();

    res.status(200).json({ message: "Location Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving location" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Location Tracker Server Running 🚀");
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});