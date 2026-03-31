const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  getWishlist,
  addToWishlist,
  updateWishlist,
  removeItem,
  clearWishlist,
} = require("../controllers/wishlist.controller");

const router = express.Router();

router.get("/", auth, getWishlist);
router.post("/add", auth, addToWishlist);
router.put("/update", auth, updateWishlist);
router.delete("/remove/:productId", auth, removeItem);
router.delete("/clear", auth, clearWishlist);

module.exports = router;
