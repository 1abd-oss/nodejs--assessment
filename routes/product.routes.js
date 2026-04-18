const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");

/* ================================
   RANGE PARSER (SAFE)
================================ */
const parseFilter = (value) => {
  if (!value) return null;

  value = value.toString().trim();

  if (value.includes("-") && !value.startsWith("-")) {
    const [min, max] = value.split("-").map(Number);
    return { type: "between", min, max };
  }

  if (value.startsWith(">=")) return { type: "gte", val: Number(value.slice(2)) };
  if (value.startsWith("<=")) return { type: "lte", val: Number(value.slice(2)) };
  if (value.startsWith(">")) return { type: "gt", val: Number(value.slice(1)) };
  if (value.startsWith("<")) return { type: "lt", val: Number(value.slice(1)) };

  return { type: "eq", val: Number(value) };
};

/* ================================
   GET PRODUCTS
================================ */
router.get("/", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      name = "",
      price = "",
      cost = "",
      quantity = "",
      sort = "productid",
      order = "ASC",
    } = req.query;

    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    let replacements = [];

    /* ================= NAME ================= */
    if (name) {
      where += " AND name LIKE ?";
      replacements.push(`%${name}%`);
    }

    const applyFilter = (field, filter) => {
      if (!filter) return;

      if (filter.type === "between") {
        where += ` AND ${field} BETWEEN ? AND ?`;
        replacements.push(filter.min, filter.max);
      }

      if (filter.type === "gte") {
        where += ` AND ${field} >= ?`;
        replacements.push(filter.val);
      }

      if (filter.type === "lte") {
        where += ` AND ${field} <= ?`;
        replacements.push(filter.val);
      }

      if (filter.type === "gt") {
        where += ` AND ${field} > ?`;
        replacements.push(filter.val);
      }

      if (filter.type === "lt") {
        where += ` AND ${field} < ?`;
        replacements.push(filter.val);
      }

      if (filter.type === "eq") {
        where += ` AND ${field} = ?`;
        replacements.push(filter.val);
      }
    };

    applyFilter("price", parseFilter(price));
    applyFilter("cost", parseFilter(cost));
    applyFilter("quantity", parseFilter(quantity));

    /* ================= SORT FIX ================= */
    let orderBy = "";

    if (sort === "profit") {
      orderBy = `ORDER BY ((price - cost) / NULLIF(cost,0)) ${order}`;
    } else {
      orderBy = `ORDER BY ${sort} ${order}`;
    }

    /* ================= DATA ================= */
    const dataQuery = `
      SELECT *,
      ((price - cost) / NULLIF(cost,0)) * 100 AS profit_percentage
      FROM products
      ${where}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const data = await sequelize.query(dataQuery, {
      replacements: [...replacements, limit, offset],
      type: sequelize.QueryTypes.SELECT,
    });

    /* ================= COUNT ================= */
    const countQuery = `
      SELECT COUNT(*) as count FROM products ${where}
    `;

    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const count = Number(countResult[0].count || 0);

    res.json({
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });

  } catch (err) {
    console.log("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   CREATE PRODUCT (FIXED)
================================ */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      cost,
      price,
      quantity
    } = req.body;

    const result = await sequelize.query(
      `
      INSERT INTO products
      (name, description, cost, price, quantity, date_added, date_modified)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `,
      {
        replacements: [
          name,
          description,
          cost,
          price,
          quantity
        ]
      }
    );

    res.json({
      message: "Product created",
      id: result[0].insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   UPDATE PRODUCT (FIXED productid)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [oldProduct] = await sequelize.query(
      "SELECT * FROM products WHERE productid = ?",
      { replacements: [id] }
    );

    if (!oldProduct.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const oldQty = oldProduct[0].quantity;

    await sequelize.query(
      `UPDATE products
       SET name=?, description=?, cost=?, price=?, quantity=?, date_modified=NOW()
       WHERE productid=?`,
      {
        replacements: [
          req.body.name,
          req.body.description,
          req.body.cost,
          req.body.price,
          req.body.quantity,
          id,
        ],
      }
    );

    const newQty = req.body.quantity;

    if (newQty !== undefined && oldQty != newQty) {
      await sequelize.query(
        `INSERT INTO inventory_changes
         (product_id, quantity_change, source, old_quantity, new_quantity, timestamp)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        {
          replacements: [
            id,
            newQty - oldQty,
            req.body.source || "manual_update",
            oldQty,
            newQty,
          ],
        }
      );
    }

    res.json({ message: "Product updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ================================
   DELETE (FIXED)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await sequelize.query(
      "DELETE FROM products WHERE productid = ?",
      { replacements: [req.params.id] }
    );

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;