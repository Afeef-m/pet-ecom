const Cart = require("../models/Cart");
const Order = require("../models/Orders");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

exports.checkout = async (userId, address) => {
  if (!address) {
    throw new ApiError("Address required", 400);
  }

  // 1. Get cart
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  let totalPrice = 0;
  const orderItems = [];

  // 2. Validate + calculate
  for (const item of cart.items) {
    const product = item.productId;

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const price = product.price;
    const quantity = item.quantity;

    totalPrice += price * quantity;

    orderItems.push({
      productId: product._id,
      quantity,
      priceAtPurchase: price,
    });
  }

  // 3. Create order
  const order = await Order.create({
    userId,
    items: orderItems,
    totalPrice,
    address,
    paymentMethod: "COD", // default for now
    status: "Pending",
  });

  // 4. Clear cart
  cart.items = [];
  await cart.save();

  return order;
};