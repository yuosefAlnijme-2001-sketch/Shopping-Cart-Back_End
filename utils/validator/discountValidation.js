const { check } = require("express-validator");
const Discount = require("../../models/discountModel");
const validMiddleware = require("../../middlewares/validMiddleware");

exports.CreateDiscountValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("الرجاء إدخال اسم الخصم")
    .isLength({ min: 2 })
    .withMessage("اسم الخصم يجب أن يكون على الأقل حرفين")
    .custom(async (val) => {
      const discount = await Discount.findOne({ name: val });
      if (discount) {
        return Promise.reject(new Error("اسم الخصم موجود بالفعل"));
      }
    }),

  check("percentage")
    .notEmpty()
    .withMessage("الرجاء إدخال نسبة الخصم")
    .isFloat({ min: 1, max: 100 })
    .withMessage("نسبة الخصم يجب أن تكون بين 1% و 100%"),

  check("expireDate")
    .notEmpty()
    .withMessage("الرجاء إدخال تاريخ انتهاء الخصم")
    .isISO8601()
    .toDate()
    .withMessage("تاريخ الانتهاء غير صالح"),

  validMiddleware,
];

exports.UpdateDiscountValidation = [
  check("id").isMongoId().withMessage("معرف الخصم غير صالح"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("اسم الخصم لا يمكن أن يكون فارغًا"),

  check("percentage")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("نسبة الخصم يجب أن تكون بين 1% و 100%"),

  check("expireDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("تاريخ الانتهاء غير صالح"),

  validMiddleware,
];

exports.DeleteDiscountValidation = [
  check("id").isMongoId().withMessage("معرف الخصم غير صالح"),
  validMiddleware,
];

exports.applyCouponValidator = [
  check("couponName")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({ min: 3 })
    .withMessage("Coupon name is too short"),

  validMiddleware,
];
