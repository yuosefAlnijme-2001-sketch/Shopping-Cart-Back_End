const express = require("express");
const router = express.Router();

const {
  uploadBrandSingleImage,
  resizeImage,
  CreateBrand,
  getBrands,
  GetBrand,
  UpdateBrand,
  deleteBrand,
} = require("../services/brandServices");
const {
  CreateBrandValidation,
  GetBrandValidation,
  UpdateBrandValidation,
  DeleteBrandValidation,
} = require("../utils/validator/brandValidation");

router
  .route("/")
  .post(uploadBrandSingleImage, resizeImage, CreateBrandValidation, CreateBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(GetBrandValidation, GetBrand)
  .put(uploadBrandSingleImage, resizeImage, UpdateBrandValidation, UpdateBrand)
  .delete(DeleteBrandValidation, deleteBrand);
module.exports = router;
