const mongoose = require("mongoose")

const productSchema =  new mongoose.Schema({
    name :String,
    category:String,
    type:{
        type:String,
        enum:["food", "accessories"],
        required:true,
    },
    price: { type: Number, required: true },
    weight: { type: String },
    image: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model("Product",productSchema)