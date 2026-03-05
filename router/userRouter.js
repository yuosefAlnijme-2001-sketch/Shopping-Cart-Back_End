const express = require("express");
const router = express.Router();

const {
  uploadUserSingleImage,
  resizeImage,
  updateLoggedUser,
  getOne,
  getLoggedUserData,
  changePassword,
} = require("../services/userServices");

const {
  updateLoggedUserValidation,
  changeValidateUserPassword,
} = require("../utils/validator/userValidation");

const { protect, allowedTo } = require("../services/authServices");

/**
 * @desc    Update logged-in user info
 * @route   PUT /api/v1/user/:id
 * @access  Private/User
 */
router.put(
  "/:id",
  protect,
  uploadUserSingleImage,
  resizeImage,
  updateLoggedUserValidation,
  updateLoggedUser,
);

/**
 * @desc    Get logged-in user data
 * @route   GET /api/v1/user/getMe
 * @access  Private/User
 */
router.get("/getMe", protect, getLoggedUserData, getOne);

/**
 * @desc    Change logged-in user's password
 * @route   PUT /api/v1/user/changePassword/:id
 * @access  Private/User
 */
router.put(
  "/changePassword/:id",
  protect,
  changeValidateUserPassword,
  changePassword,
);

module.exports = router;
