const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/userModels");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");
const Factory = require("./handelFactor");
const cloudinary = require("../utils/cloudinary");

exports.uploadUserSingleImage = uploadSingleImage("avatar");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "users",
      },
      async (error, result) => {
        if (error) {
          return next(new Error("Image upload failed"));
        }
        req.body.avatar = result.secure_url;
        next();
      },
    );

    result.end(req.file.buffer);
  } else {
    next();
  }
});

// desc Update User by id
// @router Put /api/v1/user/userId
// @access Privte

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "email", "phone", "avatar"];

  const filteredBody = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      filteredBody[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ApiError("Not Found User", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});
exports.getLoggedUserData = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// @desc    Get Logged user data
// @route   GET /api/users/getMe
// @access  Private/Protect
exports.getOne = Factory.getOne(User);

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
    },
    { new: true },
  );
  if (!user) {
    return next(ApiError(`No documents for this id user ${req.params.id}`));
  }
  res.status(200).json({ data: user, message: "Success Change Password" });
});
