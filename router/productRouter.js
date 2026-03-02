const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  uploadProductSingleImage,
  resizeImage,
  CreateProduct,
  getProducts,
  GetProduct,
  UpdateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductsByCategory,
} = require("../services/productServices");
const {
  CreateProductValidation,
  GetProductValidation,
  UpdateProductValidation,
  DeleteProductValidation,
} = require("../utils/validator/productValidation");

/**
 * @desc  Create Product
 * @route  POST /api/v1/product
 * @access Privte
 */

router
  .route("/")
  .post(
    uploadProductSingleImage,
    resizeImage,
    CreateProductValidation,
    CreateProduct,
  )
  .get(getProducts);

router
  .route("/:id")
  .get(GetProductValidation, GetProduct)
  .put(
    uploadProductSingleImage,
    resizeImage,
    UpdateProductValidation,
    UpdateProduct,
  )
  .delete(DeleteProductValidation, deleteProduct);

router.route("/:id/productlike").get(getRelatedProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
module.exports = router;
