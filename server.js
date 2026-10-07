
/**
 * SCRAPSEVA BACKEND SERVER
 * -----------------------
 * Dependencies: npm install express mongoose cors dotenv
 * Run: node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. MONGODB CONNECTION SETUP
// ---------------------------
// Set your MONGODB_URI in a .env file:
// MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/scrapseva
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scrapseva';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if cannot connect
  });

// 2. DATA MODELS (SCHEMA)
// -----------------------
const PickupRequestSchema = new mongoose.Schema({
  sellerName: String,
  collectorId: String,
  items: [{
    type: { type: String }, // 'type' is a reserved keyword in some contexts, using an object
    weightKg: Number,
    estimatedPrice: Number,
    description: String
  }],
  totalWeight: Number,
  totalPrice: Number,
  address: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  scheduledTime: Date,
  createdAt: { type: Date, default: Date.now }
});

const PickupRequest = mongoose.model('PickupRequest', PickupRequestSchema);

// 3. API ROUTES
// -------------

/**
 * @route   GET /api/requests
 * @desc    Retrieve all pickup requests
 */
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await PickupRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests', details: err.message });
  }
});

/**
 * @route   POST /api/requests
 * @desc    Create a new pickup request
 */
app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = new PickupRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create request', details: err.message });
  }
});

/**
 * @route   PATCH /api/requests/:id
 * @desc    Update status of a request
 */
app.patch('/api/requests/:id', async (req, res) => {
  try {
    const updated = await PickupRequest.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET   /api/requests`);
  console.log(`   POST  /api/requests`);
});

/**
 * INSTRUCTIONS FOR LOCAL SETUP:
 * 1. Install MongoDB locally or create a free cluster at mongodb.com/atlas.
 * 2. Create a folder for your project and save this file as 'server.js'.
 * 3. Run 'npm init -y' and 'npm install express mongoose cors dotenv'.
 * 4. Create a '.env' file and add your 'MONGODB_URI'.
 * 5. Run 'node server.js'.
 */
