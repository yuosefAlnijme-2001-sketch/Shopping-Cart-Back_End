const asyncHandler = require("express-async-handler");

const Factory = require("./handelFactor");
const Category = require("../models/categoryModels");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");

exports.uploadCategorySingleImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "category",
      },
      async (error, result) => {
        if (error) {
          return next(new Error("Image upload failed"));
        }
        req.body.image = result.secure_url;
        next();
      },
    );

    result.end(req.file.buffer);
  } else {
    next();
  }
});

// @ desc Create Category
// @router post /api/v1/category
// @access Privet
exports.CreateCategory = Factory.createOne(Category);

// @desc GET Category
// @router Get /api/v1/category
// @access Public
exports.getCategores = Factory.getAll(Category);

// desc Get Specific Category by id
// @router Get /api/v1/categorey/categoryId
// @access Public
exports.GetCategory = Factory.getOne(Category);

// desc Update Category by id
// @router Put /api/v1/categorey/categoryId
// @access Public
exports.UpdateCategory = Factory.updateOne(Category);
// desc Delete Category by id
// @router Put /api/v1/categorey/categoryId
// @access Public
exports.deleteCategory = Factory.deleteOne(Category);
