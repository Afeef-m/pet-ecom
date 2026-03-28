const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router();

// GET users (admin)
router.get("/", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// UPDATE user (admin)
router.patch("/:id", auth, admin, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const updates = req.body;

  const user = await User.findByIdAndUpdate(id, updates, { new: true });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

module.exports = router;