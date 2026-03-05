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

// checkout stripe
router.get(
  "/checkout-session/:cartId",
  authServces.protect,
  authServces.allowedTo("user"),
  checkoutSession
);

// create order
router.post(
  "/:cartId",
  authServces.protect,
  authServces.allowedTo("user"),
  createCashOrder
);

// get orders (user + admin)
router.get(
  "/",
  authServces.protect,
  authServces.allowedTo("user", "admin"),
  filterOrderForLoggedUser,
  getAllOrder
);

// get single order
router.get(
  "/:id",
  authServces.protect,
  authServces.allowedTo("user", "admin"),
  getOrder
);

// ================= ADMIN =================

// update paid
router.put(
  "/:id/pay",
  authServces.protect,
  authServces.allowedTo("admin"),
  updateOrderPaid
);

// update delivered
router.put(
  "/:id/deliver",
  authServces.protect,
  authServces.allowedTo("admin"),
  updateOrderDelivered
);

module.exports = router;