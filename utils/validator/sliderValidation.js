const { check } = require("express-validator");
const Slider = require("../../models/sliderModel");
const validMiddleware = require("../../middlewares/validMiddleware");

/* =========================
   Create Slider Validation
========================= */
exports.CreateSliderValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Please enter slider name")
    .isLength({ min: 2, max: 30 })
    .withMessage("Slider name must be between 2 and 30 characters")
    .isString()
    .withMessage("Slider name must be a string")
    .custom(async (val) => {
      const slider = await Slider.findOne({ name: val });
      if (slider) {
        return Promise.reject(new Error("Slider name already exists"));
      }
    }),

  check("des")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

  check("image")
    .trim()
    .notEmpty()
    .withMessage("Please enter slider image")
    .isString()
    .withMessage("Image must be a string")
    .isURL()
    .withMessage("Image must be a valid URL"),

  validMiddleware,
];

/* =========================
   Get Slider Validation
========================= */
exports.GetSliderValidation = [
  check("id").isMongoId().withMessage("Invalid slider id format"),
  validMiddleware,
];

/* =========================
   Update Slider Validation
========================= */
exports.UpdateSliderValidation = [
  check("id").isMongoId().withMessage("Invalid slider id format"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Slider name cannot be empty")
    .isLength({ min: 2, max: 30 })
    .withMessage("Slider name must be between 2 and 30 characters")
    .isString()
    .withMessage("Slider name must be a string")
    .custom(async (val, { req }) => {
      const slider = await Slider.findOne({
        name: val,
        _id: { $ne: req.params.id },
      });
      if (slider) {
        return Promise.reject(new Error("Slider name already exists"));
      }
    }),

  check("des")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

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
   Delete Slider Validation
========================= */
exports.DeleteSliderValidation = [
  check("id").isMongoId().withMessage("Invalid slider id format"),
  validMiddleware,
];
