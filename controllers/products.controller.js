const pool = require("../config");
const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
  const { page = 1 } = req.query;

  const products = await productService.getAllProducts(page);
  res.json(products);
};

const createProduct = async (req, res) => {
  const newProduct = await productService.addProduct(req.body);
  res.status(200).json(newProduct);
};

const getProduct = async (req, res) => {
  const product = await productService.getProductById(req.params);
  res.status(200).json(product);
};

const getProductBySlug = async (req, res) => {
  const product = await productService.getProductBySlug(req.params);
  res.status(200).json(product);
};

const getProductByName = async (req, res) => {
  const product = await productService.getProductByName(req.params);
  res.status(200).json(product);
};
const updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const { id } = req.params;

  const updatedProduct = await productService.updateProduct({
    name,
    price,
    description,
    id,
  });
  res.status(200).json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await productService.removeProduct(id);
  res.status(200).json(deletedProduct);
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByName,
  getProductBySlug,
};
