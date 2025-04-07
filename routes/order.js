const router = require("express").Router();
const {
  getOrder,
  createOrder,
  deleteOrder,
  deleteOrderGroup
} = require("../controllers/orders.controller");

const verifyToken = require("../middleware/verifyToken");

router.route("/create").post(verifyToken, createOrder);
router.route("/").get(verifyToken, getOrder);
router.route("/order-one/:id").patch(verifyToken, deleteOrder);
router.route("/order-group/:id").patch(verifyToken, deleteOrderGroup);


module.exports = router;
