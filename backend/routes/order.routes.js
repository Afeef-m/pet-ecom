const express = require("express")
const mongoose = require("mongoose")
const Order = require("../models/Orders")

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const Product = require("../models/Product");

const router = express.Router()
router.get("/",auth,admin, async(req, res)=>{
    const orders = await Order.find()
    .populate("items.productId", "name price image")
    .populate("userId", "name email");
    console.log(orders[0].userId)
    res.json(orders)
})

router.get("/user/:userId",auth, async (req, res)=>{
    const {userId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({message:"Invalid User Id"})
    }
    
    if (req.user.id !== userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
  const orders = await Order.find({ userId })
    .populate("items.productId", "name price image")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
})

router.post("/", auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const quantity = item.quantity || 1;
      const price = product.price;

      totalPrice += price * quantity;

      validatedItems.push({
        productId: product._id,
        quantity,
        priceAtPurchase: price, 
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: validatedItems,
      totalPrice,
      status: "Pending", 
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", auth, async(req, res)=>{
  const {id} =req.params
  const {status} = req.body

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({message:"Invalid Order Id"})
  }
const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  if (req.user.role !== "admin") {
  if (status !== "Cancelled") {
    return res.status(403).json({ message: "Only admin can update status" });
  }

  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }
}

  order.status = status;
  await order.save();

  res.json(order);
});


module.exports = router;