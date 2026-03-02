const { check } = require("express-validator");
const validMiddleware = require("../../middlewares/validMiddleware");

const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

// ✅ CREATE REVIEW
exports.CreateValidateReview = [
  check("rating")
    .notEmpty()
    .withMessage("Rating value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (val, { req }) => {
      // 1️⃣ تأكد المنتج موجود
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("Product not found");
      }

      // 2️⃣ تأكد المستخدم ما عمل review قبل
      const review = await Review.findOne({
        user: req.user._id,
        product: val,
      });

      if (review) {
        throw new Error("You already reviewed this product");
      }

      return true;
    }),

  validMiddleware,
];

// ✅ GET REVIEW
exports.GetValidateReview = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validMiddleware,
];

// ✅ UPDATE REVIEW
exports.UpdateValidateReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (!review) {
        throw new Error(`No review found with id ${val}`);
      }
      console.log("review user:", review.user.toString());
      console.log("logged user:", req.user._id.toString());
      // تأكد انه صاحب الريفيو
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are not allowed to perform this action");
      }

      return true;
    }),

  validMiddleware,
];

// ✅ DELETE REVIEW
exports.DeleteValidateReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (!review) {
        throw new Error("Review not found");
      }

      // لو user عادي
      if (req.user.role === "user") {
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("You are not allowed to delete this review");
        }
      }

      return true;
    }),

  validMiddleware,
];
