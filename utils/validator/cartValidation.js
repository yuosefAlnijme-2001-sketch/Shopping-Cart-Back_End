const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validMiddleware");
const Product = require("../../models/productModel");

exports.addToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("Product not found");
      }
      req.product = product;
      return true;
    }),

  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .custom((color, { req }) => {
      if (!req.product.colors.includes(color)) {
        throw new Error("Color not available for this product");
      }
      return true;
    }),

  check("size")
    .notEmpty()
    .withMessage("Size is required")
    .custom((size, { req }) => {
      if (!req.product.sizes.includes(size)) {
        throw new Error("Size not available for this product");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid cart item id"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),
  validatorMiddleware,
];

exports.removeCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid cart item id"),
  validatorMiddleware,
];


