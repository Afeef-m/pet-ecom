
// routes/order.routes.js
const express = require("express");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", auth, admin, getAllOrders);
router.get("/user/:userId", auth, getUserOrders);
router.post("/", auth, createOrder);
router.patch("/:id", auth, updateOrderStatus);

module.exports = router;

