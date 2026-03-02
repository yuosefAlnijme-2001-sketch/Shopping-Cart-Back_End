const { check } = require("express-validator");
const Category = require("../../models/categoryModels");
const validMiddleware = require("../../middlewares/validMiddleware");

/* =========================
   Create Category Validation
========================= */
exports.CreateCategoryValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter category name")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters")
    .isString()
    .withMessage("Category name must be a string")
    .custom(async (val) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        return Promise.reject(new Error("Category name already exists"));
      }
    }),

  check("image")
    .trim()
    .notEmpty()
    .withMessage("Please enter category image")
    .isString()
    .withMessage("Image must be a string")
    .isURL()
    .withMessage("Image must be a valid URL"),

  validMiddleware,
];

/* =========================
   Get Category Validation
========================= */
exports.GetCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  validMiddleware,
];

/* =========================
   Update Category Validation
========================= */
exports.UpdateCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters")
    .isString()
    .withMessage("Category name must be a string")
    .custom(async (val, { req }) => {
      const category = await Category.findOne({
        name: val,
        _id: { $ne: req.params.id },
      });
      if (category) {
        return Promise.reject(new Error("Category name already exists"));
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
   DeleteCategoryValidation
========================= */
exports.DeleteCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  validMiddleware,
];
