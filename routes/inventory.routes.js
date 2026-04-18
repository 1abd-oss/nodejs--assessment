const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");

/* =========================
   GET ALL INVENTORY
========================= */
router.get("/", async (req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT * FROM inventory_changes ORDER BY timestamp DESC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET BY PRODUCT ID
========================= */
router.get("/:productId", async (req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT * FROM inventory_changes 
       WHERE product_id = ? 
       ORDER BY timestamp DESC`,
      {
        replacements: [req.params.productId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;