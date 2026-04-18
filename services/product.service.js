const sequelize = require("../config/db");

// CREATE PRODUCT
const createProduct = async (data) => {
  const { name, description, cost, price, quantity } = data;

  await sequelize.query(
    `INSERT INTO products (name, description, cost, price, quantity)
     VALUES (?, ?, ?, ?, ?)`,
    {
      replacements: [name, description, cost, price, quantity],
    }
  );
};

// GET PRODUCT BY ID
const getProductById = async (id) => {
  const [result] = await sequelize.query(
    `SELECT * FROM products WHERE productid = ?`,
    {
      replacements: [id],
    }
  );

  return result[0];
};

// DELETE PRODUCT
const deleteProduct = async (id) => {
  await sequelize.query(
    `DELETE FROM products WHERE productid = ?`,
    {
      replacements: [id],
    }
  );
};

// UPDATE PRODUCT
const updateProduct = async (id, data) => {
  const { name, description, cost, price, quantity } = data;

  await sequelize.query(
    `UPDATE products 
     SET name=?, description=?, cost=?, price=?, quantity=?, date_modified=NOW()
     WHERE productid=?`,
    {
      replacements: [name, description, cost, price, quantity, id],
    }
  );
};

// GET ALL PRODUCTS
const getAllProducts = async () => {
  const [result] = await sequelize.query(
    `SELECT * FROM products`
  );

  return result;
};

module.exports = {
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  getAllProducts,
};