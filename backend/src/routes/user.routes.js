// routes/user.routes.js
const express = require("express");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  getUsers,
  updateUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/", auth, admin, getUsers);
router.patch("/:id", auth, admin, updateUser);

module.exports = router;