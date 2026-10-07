const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ScrapRequest = require("../models/ScrapRequest");

// =============== REGISTER ===============
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, businessName, licenseNumber, operationalArea, experienceYears } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      address: address || null,
      businessName: businessName || null,
      licenseNumber: licenseNumber || null,
      operationalArea: operationalArea || null,
      experienceYears: experienceYears || null,
      isVerified: role === "seller" ? true : false
    });

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== LOGIN ===============
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    if (role === "admin") {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ email, role });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        address: user.address || null,
        businessName: user.businessName || null,
        licenseNumber: user.licenseNumber || null,
        operationalArea: user.operationalArea || null,
        experienceYears: user.experienceYears || null,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== CREATE SCRAP REQUEST ===============
exports.createScrapRequest = async (req, res) => {
  try {
    const scrap = await ScrapRequest.create(req.body);
    res.status(201).json(scrap);
  } catch (err) {
    console.error("Create scrap error:", err);
    res.status(500).json({ message: "Failed to create scrap request" });
  }
};

// =============== GET USER SCRAP REQUESTS ===============
exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.params.id;

    const requests = await ScrapRequest.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Get scrap error:", err);
    res.status(500).json({ message: "Failed to fetch scrap requests" });
  }
};
