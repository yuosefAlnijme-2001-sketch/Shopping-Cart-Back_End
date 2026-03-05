const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  uploadProductSingleImage,
  resizeImage,
  CreateProduct,
  getProducts,
  GetProduct,
  UpdateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductsByCategory,
} = require("../services/productServices");

const {
  CreateProductValidation,
  GetProductValidation,
  UpdateProductValidation,
  DeleteProductValidation,
} = require("../utils/validator/productValidation");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Create a new product
 * @route   POST /api/v1/product
 * @access  Private (Admin)
 */
router.post(
  "/",
  protect,
  allowedTo("admin"),
  uploadProductSingleImage,
  resizeImage,
  CreateProductValidation,
  CreateProduct,
);

/**
 * @desc    Get all products
 * @route   GET /api/v1/product
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @desc    Get a specific product by ID
 * @route   GET /api/v1/product/:id
 * @access  Public
 */
router.get("/:id", GetProductValidation, GetProduct);

/**
 * @desc    Update a product
 * @route   PUT /api/v1/product/:id
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  protect,
  allowedTo("admin"),
  uploadProductSingleImage,
  resizeImage,
  UpdateProductValidation,
  UpdateProduct,
);

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/product/:id
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  DeleteProductValidation,
  deleteProduct,
);

/**
 * @desc    Get related products (like product)
 * @route   GET /api/v1/product/:id/productlike
 * @access  Public
 */
router.get("/:id/productlike", getRelatedProducts);

/**
 * @desc    Get products by category
 * @route   GET /api/v1/product/category/:categoryId
 * @access  Public
 */
router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
