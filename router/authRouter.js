const express = require("express");
const router = express.Router();

const { loginService, registerService } = require("../services/authServices");
const {
  CreateValidUser,
  LoginValidUser,
} = require("../utils/validator/authValidation");

/**
 * @desc   Register new user
 * @route  POST /api/v1/auth/register
 * @access Public
 */
router.post("/register", CreateValidUser, registerService);

/**
 * @desc   Login user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
router.post("/login", LoginValidUser, loginService);

module.exports = router;
