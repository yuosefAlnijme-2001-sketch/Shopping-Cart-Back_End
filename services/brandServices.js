const asyncHandler = require("express-async-handler");


const cloudinary = require("../utils/cloudinary");
const Factory = require("./handelFactor");
const Brand = require("../models/brandModel");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");

exports.uploadBrandSingleImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "brands",
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

// @ desc Create Brand
// @router post /api/v1/brand
// @access Privet
exports.CreateBrand = Factory.createOne(Brand);

// @desc GET Category
// @router Get /api/v1/brand
// @access Public
exports.getBrands = Factory.getAll(Brand);

// desc Get Specific Category by id
// @router Get /api/v1/brand/brandId
// @access Public
exports.GetBrand = Factory.getOne(Brand);

// desc Update Category by id
// @router Put /api/v1/brand/brandId
// @access Public
exports.UpdateBrand = Factory.updateOne(Brand);
// desc Delete Category by id
// @router Put /api/v1/brand/brandId
// @access Public
exports.deleteBrand = Factory.deleteOne(Brand);
