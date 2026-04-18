const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

/* =======================
   ROUTES
======================= */

// ✅ AUTH
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ✅ INVENTORY (MAIN FIX AREA)
const inventoryRoutes = require("./routes/inventory.routes");

// 👉 OPTIONAL: protect with auth middleware
// const authMiddleware = require("./middleware/auth");
// app.use("/api/inventory", authMiddleware, inventoryRoutes);

// 👉 for now (no auth)
app.use("/api/inventory", inventoryRoutes);

// ✅ PRODUCTS
let productRoutes;
try {
  productRoutes = require("./routes/product.routes");
  app.use("/api/products", productRoutes);
  console.log("Product routes loaded ✅");
} catch (err) {
  console.log("Product routes NOT loaded ❌");
}

/* =======================
   TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =======================
   DB CONNECTION
======================= */
sequelize.authenticate()
  .then(() => console.log("DB Connected ✅"))
  .catch((err) => console.log("DB Error ❌", err));

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});