// routes/product.routes.js
const express = require("express");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", auth, admin, createProduct);
router.patch("/:id", auth, admin, updateProduct);

module.exports = router;
