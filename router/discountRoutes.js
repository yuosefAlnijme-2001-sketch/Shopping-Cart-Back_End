const express = require("express");
const router = express.Router();

const {
  CreateDiscound,
  GetDiscound,
  getDiscounds,
  UpdateDiscound,
  deleteDiscound,
  applyCouponToCart,
} = require("../services/discountServices");

const {
  CreateDiscountValidation,
  UpdateDiscountValidation,
  DeleteDiscountValidation,
  applyCouponValidator,
} = require("../utils/validator/discountValidation");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Create new discount / coupon
 * @route   POST /api/v1/discount
 * @access  Private (Admin)
 */
router.post(
  "/",
  protect,
  allowedTo("admin"),
  CreateDiscountValidation,
  CreateDiscound,
);

/**
 * @desc    Update discount
 * @route   PUT /api/v1/discount/:id
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  protect,
  allowedTo("admin"),
  UpdateDiscountValidation,
  UpdateDiscound,
);

/**
 * @desc    Delete discount
 * @route   DELETE /api/v1/discount/:id
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  DeleteDiscountValidation,
  deleteDiscound,
);

/**
 * @desc    Apply coupon to logged user cart
 * @route   PUT /api/v1/discount/applyCoupon
 * @access  Private (User)
 */
router.put(
  "/applyCoupon",
  protect,
  allowedTo("user"),
  applyCouponValidator,
  applyCouponToCart,
);
/**
 * @desc    Get all discounts / coupons
 * @route   GET /api/v1/discount
 * @access  Public
 */
router.get("/", getDiscounds);

/**
 * @desc    Get specific discount
 * @route   GET /api/v1/discount/:id
 * @access  Public
 */
router.get("/:id", GetDiscound);
module.exports = router;
