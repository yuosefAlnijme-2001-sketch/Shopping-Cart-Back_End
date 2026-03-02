const { check } = require("express-validator");
const mongoose = require("mongoose");

const validMiddleware = require("../../middlewares/validMiddleware");
const Product = require("../../models/productModel");

exports.addToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")

    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Product ID")

    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error("Product not found");
      }
      return true;
    }),

  validMiddleware,
];

exports.removeFromWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")

    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Product ID"),

  validMiddleware,
];
