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

const authServices = require("../services/authServices");

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadBrandSingleImage,
    resizeImage,
    CreateBrandValidation,
    CreateBrand,
  )
  .get(getBrands);

router
  .route("/:id")
  .get(GetBrandValidation, GetBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadBrandSingleImage,
    resizeImage,
    UpdateBrandValidation,
    UpdateBrand,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    DeleteBrandValidation,
    deleteBrand,
  );

module.exports = router;
