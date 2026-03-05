const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams عشان productId يجي من route

const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setProductId,
  createFilterObj,
} = require("../services/reviewServices");

const {
  CreateValidateReview,
  GetValidateReview,
  UpdateValidateReview,
  DeleteValidateReview,
} = require("../utils/validator/reviewValidation");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Get all reviews (optionally filtered by product)
 * @route   GET /api/v1/review
 * @access  Private (user)
 */
router.get(
  "/",
  protect,
  allowedTo("user", "admin"),
  createFilterObj,
  getReviews,
);

/**
 * @desc    Create a review for a product
 * @route   POST /api/v1/review
 * @access  Private (user)
 */
router.post(
  "/",
  protect,
  allowedTo("user", "admin"),
  setProductId,
  CreateValidateReview,
  createReview,
);

/**
 * @desc    Get a specific review by ID
 * @route   GET /api/v1/review/:id
 * @access  Private (user)
 */
router.get(
  "/:id",
  protect,
  allowedTo("user", "admin"),
  GetValidateReview,
  getReview,
);

/**
 * @desc    Update a specific review
 * @route   PUT /api/v1/review/:id
 * @access  Private (user)
 */
router.put(
  "/:id",
  protect,
  allowedTo("user", "admin"),
  UpdateValidateReview,
  updateReview,
);

/**
 * @desc    Delete a specific review
 * @route   DELETE /api/v1/review/:id
 * @access  Private (user)
 */
router.delete(
  "/:id",
  protect,
  allowedTo("user", "admin"),
  DeleteValidateReview,
  deleteReview,
);

module.exports = router;
