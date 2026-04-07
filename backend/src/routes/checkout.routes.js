const express = require("express");
const auth = require("../middleware/auth.middleware");

const { checkout } = require("../controllers/checkout.controller");

const router = express.Router();

router.post("/", auth, checkout);

module.exports = router;