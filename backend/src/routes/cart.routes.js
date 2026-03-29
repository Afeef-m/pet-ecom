const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


// GET user cart
router.get("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id })
    .populate("items.productId");

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [],
    });
  }

  res.json(cart);
});


// ADD to cart
router.post("/add", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  const qty = Number(quantity) || 1;

  if (qty <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({
      userId: req.user.id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += qty;  
  } else {
    cart.items.push({ productId, quantity: qty });
  }

  await cart.save();

  const populatedCart = await cart.populate("items.productId");

  res.json(populatedCart);
  console.log("Add called", productId);
});

router.put("/update", authMiddleware, async (req, res) => {
  const { productId, change } = req.body;

  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = Math.max(1, item.quantity + change);

  await cart.save();

  const populatedCart = await cart.populate("items.productId");
  res.json(populatedCart);
});

// REMOVE item
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
});
router.delete("/clear", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json({ message: "Cart cleared" });
});

module.exports = router;