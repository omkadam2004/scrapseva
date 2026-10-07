const User = require("../models/User");
const Collector = require("../models/Collector");
const ScrapRequest = require("../models/ScrapRequest");

exports.getAllUsers = async (req, res) => {
  res.json(await User.find());
};

exports.getAllCollectors = async (req, res) => {
  res.json(await Collector.find());
};

exports.getAllScrapRequests = async (req, res) => {
  res.json(await ScrapRequest.find());
};
