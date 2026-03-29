// services/order.service.js
const mongoose = require("mongoose");
const Order = require("../models/Orders");
const Product = require("../models/Product");

exports.getAllOrders = async () => {
  return await Order.find()
    .populate("items.productId", "name price image")
    .populate("userId", "name email");
};

exports.getOrdersByUser = async (userId) => {
  return await Order.find({ userId })
    .populate("items.productId", "name price image")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

exports.createOrder = async (userId, items) => {
  if (!items || items.length === 0) {
    const error = new Error("No items provided");
    error.status = 400;
    throw error;
  }

  let totalPrice = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    const quantity = item.quantity || 1;
    const price = product.price;

    totalPrice += price * quantity;

    validatedItems.push({
      productId: product._id,
      quantity,
      priceAtPurchase: price,
    });
  }

  return await Order.create({
    userId,
    items: validatedItems,
    totalPrice,
    status: "Pending",
  });
};

exports.updateOrderStatus = async (id, status, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid Order Id");
    error.status = 400;
    throw error;
  }

  const order = await Order.findById(id);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "admin") {
    if (status !== "Cancelled") {
      const error = new Error("Only admin can update status");
      error.status = 403;
      throw error;
    }

    if (order.userId.toString() !== user.id) {
      const error = new Error("Access denied");
      error.status = 403;
      throw error;
    }
  }

  order.status = status;
  await order.save();

  return order;
};