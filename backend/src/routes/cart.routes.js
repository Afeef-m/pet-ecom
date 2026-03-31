const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  getCart,
  addToCart,
  updateCart,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateCart);
router.delete("/remove/:productId", auth, removeItem);
router.delete("/clear", auth, clearCart);

module.exports = router;