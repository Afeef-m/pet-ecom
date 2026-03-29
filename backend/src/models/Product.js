const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      index: true, 
    },

    type: {
      type: String,
      enum: ["food", "accessories"],
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg"],
      },
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);