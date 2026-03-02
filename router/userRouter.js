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
const authServices = require("../services/authServices");
/**
 * @desc   Update user _id
 * @route  POST /api/v1/user/:id
 * @access Privet
 */
router.put(
  "/:id",
  uploadUserSingleImage,
  resizeImage,
  authServices.protect,
  updateLoggedUserValidation,
  updateLoggedUser,
);

router.get("/getMe", authServices.protect, getLoggedUserData, getOne);

router.put("/changePassword/:id", changeValidateUserPassword, changePassword);
module.exports = router;
