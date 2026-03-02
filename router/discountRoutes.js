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
const authServces = require("../services/authServices");
router
  .route("/")
  .post(CreateDiscountValidation, CreateDiscound)
  .get(getDiscounds);

// apply coupon
router.put(
  "/applyCoupon",
  authServces.protect,
  applyCouponValidator,
  applyCouponToCart,
);

router
  .route("/:id")
  .get(GetDiscound)
  .put(UpdateDiscountValidation, UpdateDiscound)
  .delete(DeleteDiscountValidation, deleteDiscound);

module.exports = router;
