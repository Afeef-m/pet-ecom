const express = require("express");
const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user.id })
    .populate("items.productId");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: req.user.id,
      items: [],
    });
  }

  res.json(wishlist);
});

router.post("/add", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  let wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    wishlist = new Wishlist({
      userId: req.user.id,
      items: [],
    });
  }

  const exists = wishlist.items.find(
    (item) => item.productId.toString() === productId
  );

  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  wishlist.items.push({ productId });

  await wishlist.save();

  const populatedWishlist = await wishlist.populate("items.productId");

  res.status(201).json(populatedWishlist);
});

router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await wishlist.save();

  const populatedWishlist = await wishlist.populate("items.productId");

  res.json(populatedWishlist);
});

router.delete("/clear", authMiddleware, async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({ message: "Wishlist cleared" });
});

module.exports = router;