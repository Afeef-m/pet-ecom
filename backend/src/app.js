const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://pet-ecom-nine.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// routes
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/users", require("./routes/user.routes"));

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
app.use(errorMiddleware);

module.exports = app;