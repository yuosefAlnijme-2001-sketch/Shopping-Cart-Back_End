const { check } = require("express-validator");
const User = require("../../models/userModels");
const validMiddleware = require("../../middlewares/validMiddleware");

/* =========================
   Register Validation
========================= */
exports.CreateValidUser = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("Please enter first name")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters")
    .isString()
    .withMessage("First name must be a string"),

  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("Please enter last name")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters")
    .isString()
    .withMessage("Last name must be a string"),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("Email already in use"));
      }
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((val, { req }) => {
      if (req.body.passwordConfirm !== val) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please confirm your password"),

  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Please enter phone number")
    .isMobilePhone(["ar-PS"])
    .withMessage("Invalid Palestinian phone number"),

  check("avatar").optional(),
  check("role").optional().isIn(["user", "admin"]),

  validMiddleware,
];

/* =========================
   Login Validation
========================= */
exports.LoginValidUser = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password").trim().notEmpty().withMessage("Please enter password"),

  validMiddleware,
];
