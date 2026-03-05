const express = require("express");
const router = express.Router();

const {
  uploadSliderSingleImage,
  resizeImage,
  CreateSlider,
  GetSlider,
  getSliders,
  UpdateSlider,
  deleteSlider,
} = require("../services/sliderServices");

const {
  CreateSliderValidation,
  GetSliderValidation,
  UpdateSliderValidation,
  DeleteSliderValidation,
} = require("../utils/validator/sliderValidation");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Get all sliders
 * @route   GET /api/v1/slider
 * @access  Public
 */
router.get("/", getSliders);

/**
 * @desc    Create a new slider
 * @route   POST /api/v1/slider
 * @access  Private/Admin
 */
router.post(
  "/",
  protect,
  allowedTo("admin"),
  uploadSliderSingleImage,
  resizeImage,
  CreateSliderValidation,
  CreateSlider,
);

/**
 * @desc    Get a specific slider by ID
 * @route   GET /api/v1/slider/:id
 * @access  Public
 */
router.get("/:id", GetSliderValidation, GetSlider);

/**
 * @desc    Update a slider
 * @route   PUT /api/v1/slider/:id
 * @access  Private/Admin
 */
router.put(
  "/:id",
  protect,
  allowedTo("admin"),
  uploadSliderSingleImage,
  resizeImage,
  UpdateSliderValidation,
  UpdateSlider,
);

/**
 * @desc    Delete a slider
 * @route   DELETE /api/v1/slider/:id
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  DeleteSliderValidation,
  deleteSlider,
);

module.exports = router;
