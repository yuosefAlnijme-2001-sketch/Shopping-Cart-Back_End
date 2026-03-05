const express = require("express");
const router = express.Router();

const {
  addToWishList,
  removeFromWishlist,
  getWishlist,
  toggleWishlist,
} = require("../services/wishlistServices");

const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../utils/validator/wishlistValidation");

const { protect } = require("../services/authServices");

/**
 * @desc    Get logged-in user's wishlist
 * @route   GET /api/v1/wishlist
 * @access  Private/User
 */
router.get("/", protect, getWishlist);

/**
 * @desc    Add product to wishlist
 * @route   POST /api/v1/wishlist
 * @access  Private/User
 */
router.post("/", protect, toggleWishlist);

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  Private/User
 */
router.delete(
  "/:productId",
  protect,
  removeFromWishlistValidator,
  removeFromWishlist,
);

module.exports = router;
