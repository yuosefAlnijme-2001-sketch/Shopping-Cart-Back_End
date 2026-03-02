const express = require("express");
const router = express.Router();

const {
  uploadSliderSingleImage,
  resizeImage,
  CreateSlider,
  GetSlider,
  getSliders,
  UpdateSlider,
  deleteSlider,
} = require("../services/sliderServices");
const {
  CreateSliderValidation,
  GetSliderValidation,
  UpdateSliderValidation,
  DeleteSliderValidation,
} = require("../utils/validator/sliderValidation");

router
  .route("/")
  .post(
    uploadSliderSingleImage,
    resizeImage,
    CreateSliderValidation,
    CreateSlider,
  )
  .get(getSliders);

router
  .route("/:id")
  .get(GetSliderValidation, GetSlider)
  .put(
    uploadSliderSingleImage,
    resizeImage,
    UpdateSliderValidation,
    UpdateSlider,
  )
  .delete(DeleteSliderValidation, deleteSlider);
module.exports = router;
