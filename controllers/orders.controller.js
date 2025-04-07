const orderService = require("../services/order.service");
const cartService = require("../services/cart.service");


const createOrder = async (req, res) => {
  const userId = req.user.id;
  const cartDetail = await cartService.getCartByUserId(userId);
  const order = await orderService.createOrder(cartDetail,userId);
  res.status(201).json(order);
};

const getOrder = async (req, res) => {
  const userId = req.user.id;
  const order = await orderService.getOrderById(userId);
  res.json(order);
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;
  const order = await orderService.deleteOrder(id);
  res.status(200).json(order);
};

const deleteOrderGroup = async (req, res) => {
  const id = req.params.id;
  const order = await orderService.deleteOrderGroup(id);
  res.status(200).json(order);
};

module.exports = {
  createOrder,
  getOrder,
  deleteOrder,
  deleteOrderGroup
};
