const {
  createOrderDb,
  getOrderDb,
  deleteOrderDb,
  deleteOrderGroupDb
} = require("../db/orders.db");
const { ErrorHandler } = require("../helpers/error");

class OrderService {
  createOrder = async (data,userId) => {
    try {
      return await createOrderDb(data,userId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getOrderById = async (userId) => {
    try {
      const order = await getOrderDb(userId);
      if (!order) {
        throw new ErrorHandler(404, "Order does not exist");
      }
      return order;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  deleteOrder = async (id) => {
    try {
      return await deleteOrderDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  deleteOrderGroup = async (id) => {
    try {
      return await deleteOrderGroupDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new OrderService();
