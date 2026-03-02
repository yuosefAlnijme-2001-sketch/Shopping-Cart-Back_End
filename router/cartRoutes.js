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

const { protect } = require("../services/authServices");

// add to cart
router.post("/", protect, addToCartValidator, addProductsToCart);

// get cart
router.get("/", protect, getLoggedUserCart);

// remove item
router.delete("/:itemId", protect, removeCartItemValidator, removeCartProduct);

// clear cart
router.delete("/", protect, clearLoggedUserCart);

// update quantity
router.put(
  "/:itemId",
  protect,
  updateCartItemValidator,
  updateCartProductCount,
);

module.exports = router;
