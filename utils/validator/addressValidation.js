const { check } = require("express-validator");
const validMiddleware = require("../../middlewares/validMiddleware");
const User = require("../../models/userModels");
exports.addAddressValidation = [
  check("alias")
    .notEmpty()
    .withMessage("Address alias is required")
    .isString()
    .withMessage("Alias must be a string"),
  check("details")
    .notEmpty()
    .withMessage("Address details are required")
    .isString()
    .withMessage("Details must be a string"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-PS"])
    .withMessage("Invalid Palestinian phone number"),
  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  check("postCode")
    .optional()
    .isString()
    .withMessage("Post code must be a string"),
  validMiddleware,
];

exports.removeAddressValidation = [
  check("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID format")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      if (!user) {
        throw new Error("User not found");
      }

      const addressExists = user.addresses.some(
        (addr) => addr._id.toString() === val,
      );

      if (!addressExists) {
        throw new Error("Address not found for this user");
      }

      return true;
    }),

  validMiddleware,
];

exports.getAddressValidation = [
  check("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID format")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      if (!user) {
        throw new Error("User not found");
      }

      const address = user.addresses.id(val);

      if (!address) {
        throw new Error("Address not found");
      }

      return true;
    }),

  validMiddleware,
];

exports.myAddressesValidation = [
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    next();
  },
  validMiddleware,
];

exports.updateAddressValidation = [
  check("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      if (!user) {
        throw new Error("User not found");
      }

      const address = user.addresses.id(val);

      if (!address) {
        throw new Error("Address not found");
      }

      return true;
    }),

  check("alias").optional().isString().withMessage("Alias must be a string"),

  check("details")
    .optional()
    .isString()
    .withMessage("Details must be a string"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-PS"])
    .withMessage("Invalid Palestinian phone number"),

  check("city").optional().isString().withMessage("City must be a string"),

  check("postCode")
    .optional()
    .isString()
    .withMessage("Post code must be a string"),

  validMiddleware,
];
