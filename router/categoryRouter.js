const express = require("express");
const router = express.Router();

const {
  uploadCategorySingleImage,
  resizeImage,
  CreateCategory,
  getCategores,
  GetCategory,
  UpdateCategory,
  deleteCategory,
} = require("../services/categoryServices");

const {
  CreateCategoryValidation,
  GetCategoryValidation,
  UpdateCategoryValidation,
  DeleteCategoryValidation,
} = require("../utils/validator/categoryValidations");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Create new category
 * @route   POST /api/v1/category
 * @access  Private (Admin)
 */
router.post(
  "/",
  protect,
  allowedTo("admin"),
  uploadCategorySingleImage,
  resizeImage,
  CreateCategoryValidation,
  CreateCategory,
);

/**
 * @desc    Get all categories
 * @route   GET /api/v1/category
 * @access  Public
 */
router.get("/", getCategores);

/**
 * @desc    Get specific category
 * @route   GET /api/v1/category/:id
 * @access  Public
 */
router.get("/:id", GetCategoryValidation, GetCategory);

/**
 * @desc    Update category
 * @route   PUT /api/v1/category/:id
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  protect,
  allowedTo("admin"),
  uploadCategorySingleImage,
  resizeImage,
  UpdateCategoryValidation,
  UpdateCategory,
);

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/category/:id
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  DeleteCategoryValidation,
  deleteCategory,
);

module.exports = router;
