const { check } = require("express-validator");
const Brand = require("../../models/brandModel");
const validMiddleware = require("../../middlewares/validMiddleware");

/* =========================
   Create Brand Validation
========================= */
exports.CreateBrandValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter brand name")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters")
    .isString()
    .withMessage("Brand name must be a string")
    .custom(async (val) => {
      const brand = await Brand.findOne({ name: val });
      if (brand) {
        return Promise.reject(new Error("Brand name already exists"));
      }
    }),

  check("image")
    .trim()
    .notEmpty()
    .withMessage("Please enter brand image")
    .isString()
    .withMessage("Image must be a string")
    .isURL()
    .withMessage("Image must be a valid URL"),

  validMiddleware,
];

/* =========================
   Get Brand Validation
========================= */
exports.GetBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  validMiddleware,
];

/* =========================
   Update Brand Validation
========================= */
exports.UpdateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Brand name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters")
    .isString()
    .withMessage("Brand name must be a string")
    .custom(async (val, { req }) => {
      const brand = await Brand.findOne({
        name: val,
        _id: { $ne: req.params.id },
      });
      if (brand) {
        return Promise.reject(new Error("Brand name already exists"));
      }
    }),

  check("image")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Image cannot be empty")
    .isString()
    .withMessage("Image must be a string")
    .isURL()
    .withMessage("Image must be a valid URL"),

  validMiddleware,
];

/* =========================
   Delete Brand Validation
========================= */
exports.DeleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  validMiddleware,
];
