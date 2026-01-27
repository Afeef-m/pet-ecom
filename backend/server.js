const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")
const app = express();
app.use(express.urlencoded({ extended: true }));

// middleware
app.use(cors())
app.use(express.json())

// connect DB
connectDB()

app.get("/",(req, res)=>{
    res.send("Backend is running")
})
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/auth", require("./routes/auth.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{console.log(`Server is running on http://localhost:${PORT}`)})