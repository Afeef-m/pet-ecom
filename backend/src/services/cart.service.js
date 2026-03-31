const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const calcTotal = (cart) =>
  cart.items.reduce(
    (sum, item) =>
      sum + (item.priceAtAdd || item.productId?.price || 0) * item.quantity,
    0
  );

const populatedResponse = async (cart) => {
  const populated = await cart.populate("items.productId");
  return { ...populated.toObject(), total: calcTotal(populated) };
};

exports.getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return { ...cart.toObject(), total: calcTotal(cart) };
};

exports.addToCart = async (userId, productId, quantity) => {
  const qty = Number(quantity) || 1;
  if (qty <= 0) throw new ApiError("Invalid quantity", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const hasStock = typeof product.stock === "number";

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + qty;
    if (hasStock && newQty > product.stock) {
      throw new ApiError("Exceeds available stock", 400);
    }
    existingItem.quantity = newQty;
    if (!existingItem.priceAtAdd) {
      existingItem.priceAtAdd = product.price;
    }
  } else {
    if (hasStock && qty > product.stock) {
      throw new ApiError("Insufficient stock", 400);
    }
    cart.items.push({
      productId,
      quantity: qty,
      priceAtAdd: product.price,
    });
  }

  await cart.save();
  return populatedResponse(cart); 
};

exports.updateCartItem = async (userId, productId, change) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) throw new ApiError("Item not found", 404);

  const newQty = item.quantity + change;

  if (newQty <= 0) {
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );
    await cart.save();
    return populatedResponse(cart);
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const hasStock = typeof product.stock === "number";
  if (hasStock && newQty > product.stock) {
    throw new ApiError("Exceeds available stock", 400);
  }

  item.quantity = newQty;
  await cart.save();
  return populatedResponse(cart);
};

exports.removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return populatedResponse(cart);
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return { message: "Cart cleared" };
};