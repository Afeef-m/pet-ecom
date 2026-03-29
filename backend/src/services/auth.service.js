// services/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing");
}

exports.register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throwError("All fields are required", 400);
  }

  email = email.toLowerCase().trim();

  if (!email.includes("@")) {
    throwError("Invalid email", 400);
  }

  if (password.length < 4) {
    throwError("Password too short", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throwError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    status: "active",
  });

  return {
    message: "User registered successfully",
    user: sanitizeUser(user),
  };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throwError("Email & password required", 400);
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password");
  if (!user) throwError("Invalid credentials", 401);

  if (user.status !== "active") {
    throwError(`Account is ${user.status}`, 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throwError("Invalid credentials", 401);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Login successful",
    token,
    user: sanitizeUser(user),
  };
};

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function throwError(message, status) {
  const err = new Error(message);
  err.status = status;
  throw err;
}