const { check } = require("express-validator");
const User = require("../../models/userModels");
const bcrypt = require("bcryptjs");
const validMiddleware = require("../../middlewares/validMiddleware");

exports.updateLoggedUserValidation = [
  check("firstName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters")
    .isString()
    .withMessage("First name must be a string"),

  check("lastName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters")
    .isString()
    .withMessage("Last name must be a string"),

  check("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });

      // إذا لقى مستخدم بنفس الإيميل وكان مش نفس المستخدم الحالي
      if (user && user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(new Error("Email already in use"));
      }
    }),

  check("phone")
    .optional()
    .trim()
    .isMobilePhone(["ar-PS"])
    .withMessage("Invalid Palestinian phone number"),

  check("avatar").optional(),

  // 🚫 منع تعديل role
  check("role").not().exists().withMessage("You cannot update role"),

  // 🚫 منع تعديل password من هنا
  check("password").not().exists().withMessage("Use update password endpoint"),

  validMiddleware,
];

exports.changeValidateUserPassword = [
  check("id").isMongoId().withMessage("Invalid format id"),
  check("currentPassword").notEmpty().withMessage("Please Enter Old Password"),
  check("newPassword").notEmpty().withMessage("Please Enter New Password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please Enter Confirm New Password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id).select("+password"); // ✅ مهم
      if (!user) {
        throw new Error("There is no user for this id");
      }
      if (!user.password) {
        throw new Error("User password not found");
      }
      const isCurrentPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isCurrentPassword) {
        throw new Error("Please enter a correct password.");
      }
      if (req.body.newPassword !== val) {
        throw new Error("New Password and Confirm Password do not match");
      }
      return true;
    }),
  validMiddleware,
];
