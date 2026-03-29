// services/user.service.js
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

exports.getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const matchFilter = {};

  if (query.search && query.search.trim() !== "") {
    const regex = new RegExp(query.search.trim(), "i");
    matchFilter.$or = [{ name: regex }, { email: regex }];
  }

  if (query.status && query.status !== "All") {
    matchFilter.status = query.status;
  }

  const pipeline = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $addFields: {
        orderCount: { $size: "$orders" },
      },
    },
    {
      $project: {
        password: 0,
        orders: 0,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const [users, totalResult] = await Promise.all([
    User.aggregate(pipeline),
    User.countDocuments(matchFilter),
  ]);

  return {
    data: users,
    total: totalResult,
    page,
    limit,
  };
};

exports.updateUser = async (id, data) => {
  const allowedFields = ["name", "status"];

  const updates = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updates[key] = data[key];
    }
  }

  if (data.password) {
    throw new ApiError("Password update not allowed here", 400);
  }

  if (data.role) {
    throw new ApiError("Role update restricted", 403);
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
};

exports.getUsersWithOrderCount = async () => {
  return await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders",
      },
    },
    {
      $addFields: {
        orderCount: { $size: "$orders" },
      },
    },
    {
      $project: {
        password: 0,
        orders: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};