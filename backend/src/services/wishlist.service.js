const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const calcTotal = (wishlist) =>
  wishlist.items.reduce(
    (sum, item) =>
      sum + (item.priceAtAdd || item.productId?.price || 0) * item.quantity,
    0
  );

  const populatedResponse = async (wishlist) => {
  const populated = await wishlist.populate("items.productId");
  return { ...populated.toObject(), total: calcTotal(populated) };
};


exports.getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
  if (!wishlist) {
    wishlist = await wishlist.create({ userId, items: [] });
  }
  return { ...wishlist.toObject(), total: calcTotal(wishlist) };
};

exports.addToWishlist = async (userId, productId, quantity) => {
  const qty = Number(quantity) || 1;
  if (qty <= 0) throw new ApiError("Invalid quantity", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const hasStock = typeof product.stock === "number";

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) wishlist = new Wishlist({ userId, items: [] });

  const existingItem = wishlist.items.find(
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
    wishlist.items.push({
      productId,
      quantity: qty,
      priceAtAdd: product.price,
    });
  }

  await wishlist.save();
  return populatedResponse(wishlist); 
};


exports.updateWishlist = async (userId, productId, change) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new ApiError("Wishlist not found", 404);

  const item = wishlist.items.find((i) => i.productId.toString() === productId);
  if (!item) throw new ApiError("Item not found", 404);

  const newQty = item.quantity + change;

  if (newQty <= 0) {
    wishlist.items = wishlist.items.filter(
      (i) => i.productId.toString() !== productId
    );
    await wishlist.save();
    return populatedResponse(wishlist);
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const hasStock = typeof product.stock === "number";
  if (hasStock && newQty > product.stock) {
    throw new ApiError("Exceeds available stock", 400);
  }

  item.quantity = newQty;
  await wishlist.save();
  return populatedResponse(wishlist);
};

exports.removeItem = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new ApiError("Wishlist not found", 404);

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await wishlist.save();
  return populatedResponse(wishlist);
};

exports.clearWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (wishlist) {
    wishlist.items = [];
    await wishlist.save();
  }
  return { message: "Wishlist cleared" };
};