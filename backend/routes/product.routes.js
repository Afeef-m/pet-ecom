// const express = require("express")
// const Product = require("../models/Product")

// const router = express.Router()

// router.get("/",async(req,res)=>{
//     const filter = {status:"active"}
//     if(req.query.type)filter.type = req.query.type;
//     if(req.query.category)filter.category = req.query.category;

//     const products =await Product.find(filter)
//     res.json(products)
// })
// router.get("/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   res.json(product);
// });

// const auth = require("../middleware/auth.middleware");
// const admin = require("../middleware/admin.middleware");

// router.post("/", auth, admin, async (req, res) => {
//   const product = await Product.create(req.body);
//   res.status(201).json(product);
// });

// router.patch("/:id", auth, admin, async (req, res) => {
//   const updatedProduct = await Product.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );
//   res.json(updatedProduct);
// });

// module.exports = router


const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // ONLY add status if your schema actually supports it
    // filter.status = "active";

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid product id" });
  }
});

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.post("/", auth, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Product creation failed" });
  }
});

router.patch("/:id", auth, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
});

module.exports = router;
