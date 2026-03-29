// services/product.service.js
const Product = require("../models/Product");

exports.getProducts = async (query) => {
  const filter = {};

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;

    if (query.search && query.search.trim() !== "") {
    filter.name = { $regex: query.search.trim(), $options: "i" };
  }

  if (query.showAll !== "true") {
    filter.status = "active";
  }


const page = Math.max(parseInt(query.page) || 1, 1);
const limit = Math.min(parseInt(query.limit) || 5, 100);
const skip = (page - 1) * limit;

 let sortOption = { createdAt: -1 }; 
  if (query.sort === "lowToHigh") sortOption = { price: 1 };
  if (query.sort === "highToLow") sortOption = { price: -1 };

const [products, total] = await Promise.all([
  Product.find(filter)
    .select("name price image category type weight description status")
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean(),

  Product.countDocuments(filter),
]);

return {
  data: products,
  page,
  totalPages: Math.ceil(total / limit),
  totalItems: total,
};
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.createProduct = async (data) => {
  const allowedFields = [
    "name",
    "price",
    "image",
    "category",
    "type",
    "description",
    "weight",
    "status"
  ];

  const filteredData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  }

  return await Product.create(filteredData);
};

exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true, 
  });
};