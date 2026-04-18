const service = require("../services/product.service");

// CREATE
const create = async (req, res) => {
  try {
    await service.createProduct(req.body);
    res.json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
const getById = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const remove = async (req, res) => {
  try {
    await service.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    await service.updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL (WITH PROFIT)
const getAll = async (req, res) => {
  try {
    let products = await service.getAllProducts();

    // ADD PROFIT FIELD
    products = products.map((p) => ({
      ...p,
      profit_percentage: ((p.price - p.cost) / p.cost) * 100,
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  create,
  getById,
  remove,
  update,
  getAll,
};