const express = require("express")
const mongoose = require("mongoose")
const Order = require("../models/Orders")

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router()
router.get("/",auth,admin, async(req, res)=>{
    const orders = await Order.find()
    .populate("items.productId", "name price image")
    .populate("userId", "name email");
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
    .sort({ createdAt: -1 });

  res.json(orders);
})

router.post("/", auth, async (req, res) => {
  const order = await Order.create({
    ...req.body,
    userId: req.user.id, 
  });

  res.status(201).json(order);
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

  if (
    order.userId.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  order.status = status;
  await order.save();

  res.json(order);
});


module.exports = router;