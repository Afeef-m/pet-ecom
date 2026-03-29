// controllers/order.controller.js
const mongoose = require("mongoose");
const orderService = require("../services/order.service");

exports.getAllOrders = async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(orders);
};

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User Id" });
  }

  if (req.user.id !== userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const orders = await orderService.getOrdersByUser(userId);
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body.items);
    res.status(201).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user
    );

    res.json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};