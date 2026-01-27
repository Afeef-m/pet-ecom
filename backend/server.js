const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// body parsers FIRST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS NEXT
app.use(
  cors({
    origin: "https://pet-ecom-nine.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DB
connectDB();

// routes
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
