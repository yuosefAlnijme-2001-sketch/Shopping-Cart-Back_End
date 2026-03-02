const asyncHandler = require("express-async-handler");

const Factory = require("./handelFactor");
const Slider = require("../models/sliderModel");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");

exports.uploadSliderSingleImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "slider",
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

// @ desc Create Slider
// @router post /api/v1/slider
// @access Privet
exports.CreateSlider = Factory.createOne(Slider);

// @desc GET Slider
// @router Get /api/v1/slider
// @access Public
exports.getSliders = Factory.getAll(Slider);

// desc Get Specific Slider by id
// @router Get /api/v1/slider/sliderId
// @access Public
exports.GetSlider = Factory.getOne(Slider);

// desc Update Slider by id
// @router Put /api/v1/slider/sliderId
// @access Public
exports.UpdateSlider = Factory.updateOne(Slider);
// desc Delete Slider by id
// @router Put /api/v1/slider/sliderId
// @access Public
exports.deleteSlider = Factory.deleteOne(Slider);
