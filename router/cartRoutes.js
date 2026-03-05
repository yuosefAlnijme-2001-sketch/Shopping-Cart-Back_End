const express = require("express");
const router = express.Router();

const {
  addProductsToCart,
  getLoggedUserCart,
  removeCartProduct,
  clearLoggedUserCart,
  updateCartProductCount,
} = require("../services/cartServices");

const {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} = require("../utils/validator/cartValidation");

const { protect, allowedTo } = require("../services/authServices");

// add to cart
router.post(
  "/",
  protect,
  allowedTo("user"),
  addToCartValidator,
  addProductsToCart,
);

// get cart
router.get("/", protect, allowedTo("user"), getLoggedUserCart);

// remove item
router.delete(
  "/:itemId",
  protect,
  allowedTo("user"),
  removeCartItemValidator,
  removeCartProduct,
);

// clear cart
router.delete("/", protect, allowedTo("user"), clearLoggedUserCart);

// update quantity
router.put(
  "/:itemId",
  protect,
  allowedTo("user"),
  updateCartItemValidator,
  updateCartProductCount,
);

module.exports = router;
