const { check } = require("express-validator");
const Category = require("../../models/categoryModels");
const Brand = require("../../models/brandModel");
const Product = require("../../models/productModel");
const validMiddleware = require("../../middlewares/validMiddleware");

/* =========================
   إنشاء منتج - Create Product Validation
========================= */
exports.CreateProductValidation = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("الرجاء إدخال اسم المنتج")
    .isLength({ min: 2 })
    .withMessage("اسم المنتج يجب أن يكون على الأقل حرفين")
    .isString()
    .withMessage("اسم المنتج يجب أن يكون نصًا")
    .custom(async (val) => {
      const product = await Product.findOne({ name: val });
      if (product) {
        return Promise.reject(new Error("اسم المنتج موجود بالفعل"));
      }
    }),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("الرجاء إدخال وصف المنتج")
    .isString()
    .withMessage("وصف المنتج يجب أن يكون نصًا"),

  check("originalPrice")
    .notEmpty()
    .withMessage("الرجاء إدخال السعر الأصلي")
    .isFloat({ gt: 0 })
    .withMessage("السعر الأصلي يجب أن يكون رقم أكبر من صفر"),

  check("discountedPrice")
    .notEmpty()
    .withMessage("الرجاء إدخال سعر الخصم")
    .isFloat({ gt: 0 })
    .withMessage("سعر الخصم يجب أن يكون رقم أكبر من صفر")
    .custom((value, { req }) => {
      if (value > req.body.originalPrice) {
        throw new Error("سعر الخصم لا يمكن أن يكون أكبر من السعر الأصلي");
      }
      return true;
    }),
  check("olor").optional().toArray(),

  check("sizes").optional().toArray(),

  check("image")
    .notEmpty()
    .withMessage("الرجاء إدخال صورة المنتج الرئيسية")
    .isURL()
    .withMessage("الصورة يجب أن تكون رابط صالح"),

  check("images")
    .optional()
    .isArray()
    .withMessage("الصور الإضافية يجب أن تكون مصفوفة")
    .custom((arr) => arr.every((url) => typeof url === "string"))
    .withMessage("كل صورة يجب أن تكون رابط صالح"),

  check("category")
    .notEmpty()
    .withMessage("الرجاء اختيار تصنيف")
    .isMongoId()
    .withMessage("معرف التصنيف غير صالح")
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category) throw new Error("التصنيف غير موجود");
    }),

  check("brand")
    .notEmpty()
    .withMessage("الرجاء اختيار البراند")
    .isMongoId()
    .withMessage("معرف البراند غير صالح")
    .custom(async (val) => {
      const brand = await Brand.findById(val);
      if (!brand) throw new Error("البراند غير موجود");
    }),

  check("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("الكمية يجب أن تكون رقم صحيح أكبر أو يساوي صفر"),

  validMiddleware,
];

/* =========================
   الحصول على منتج - Get Product Validation
========================= */
exports.GetProductValidation = [
  check("id").isMongoId().withMessage("معرف المنتج غير صالح"),
  validMiddleware,
];

/* =========================
   تحديث منتج - Update Product Validation
========================= */
exports.UpdateProductValidation = [
  check("id").isMongoId().withMessage("معرف المنتج غير صالح"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("اسم المنتج لا يمكن أن يكون فارغًا")
    .isLength({ min: 2 })
    .withMessage("اسم المنتج يجب أن يكون على الأقل حرفين")
    .isString()
    .withMessage("اسم المنتج يجب أن يكون نصًا"),

  check("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("وصف المنتج لا يمكن أن يكون فارغًا")
    .isString()
    .withMessage("وصف المنتج يجب أن يكون نصًا"),

  check("originalPrice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("السعر الأصلي يجب أن يكون رقم أكبر من صفر"),

  check("discountedPrice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("سعر الخصم يجب أن يكون رقم أكبر من صفر")
    .custom((value, { req }) => {
      if (req.body.originalPrice && value > req.body.originalPrice) {
        throw new Error("سعر الخصم لا يمكن أن يكون أكبر من السعر الأصلي");
      }
      return true;
    }),

  check("colors").optional().toArray(),

  check("sizes").optional().toArray(),

  check("image").optional().isURL().withMessage("الصورة يجب أن تكون رابط صالح"),

  // check("images")
  //   .optional()
  //   .isArray()
  //   .withMessage("الصور الإضافية يجب أن تكون مصفوفة")
  //   .custom((arr) => arr.every((url) => typeof url === "string"))
  //   .withMessage("كل صورة يجب أن تكون رابط صالح"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("معرف التصنيف غير صالح")
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category) throw new Error("التصنيف غير موجود");
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("معرف البراند غير صالح")
    .custom(async (val) => {
      const brand = await Brand.findById(val);
      if (!brand) throw new Error("البراند غير موجود");
    }),

  check("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("الكمية يجب أن تكون رقم صحيح أكبر أو يساوي صفر"),

  validMiddleware,
];

/* =========================
   حذف منتج - Delete Product Validation
========================= */
exports.DeleteProductValidation = [
  check("id").isMongoId().withMessage("معرف المنتج غير صالح"),
  validMiddleware,
];
