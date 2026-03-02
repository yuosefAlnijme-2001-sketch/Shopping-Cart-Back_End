const express = require("express");
const router = express.Router();

const {
  createCashOrder,
  getAllOrder,
  getOrder,
  filterOrderForLoggedUser,
  updateOrderDelivered,
  updateOrderPaid,
  checkoutSession,
} = require("../services/orderServices");
const authServces = require("../services/authServices");

router.get("/checkout-session/:cartId", authServces.protect, checkoutSession);

router.route("/:cartId").post(authServces.protect, createCashOrder);

router.get("/", authServces.protect, filterOrderForLoggedUser, getAllOrder);
router.get("/:id", authServces.protect, getOrder);

// Admin
router.put("/:id/pay", authServces.protect, updateOrderPaid);
router.put("/:id/deliver", authServces.protect, updateOrderDelivered);
module.exports = router;
