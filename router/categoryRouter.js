const express = require("express");
const router = express.Router();

const {
  uploadCategorySingleImage,
  resizeImage,
  CreateCategory,
  getCategores,
  GetCategory,
  UpdateCategory,
  deleteCategory,
} = require("../services/categoryServices");
const {
  CreateCategoryValidation,
  GetCategoryValidation,
  UpdateCategoryValidation,
  DeleteCategoryValidation,
} = require("../utils/validator/categoryValidations");

/**
 * @desc  Create Category
 * @route  POST /api/v1/category
 * @access Privte
 */

router
  .route("/")
  .post(
    uploadCategorySingleImage,
    resizeImage,
    CreateCategoryValidation,
    CreateCategory,
  )
  .get(getCategores);

router
  .route("/:id")
  .get(GetCategoryValidation, GetCategory)
  .put(
    uploadCategorySingleImage,
    resizeImage,
    UpdateCategoryValidation,
    UpdateCategory,
  )
  .delete(DeleteCategoryValidation, deleteCategory);
module.exports = router;
