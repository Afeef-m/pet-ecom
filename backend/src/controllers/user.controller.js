// controllers/user.controller.js
const mongoose = require("mongoose");
const userService = require("../services/user.service");

exports.getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);

    res.json(result); 
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await userService.updateUser(id, req.body);

    res.json(user);
  } catch (err) {
    next(err);
  }
};
