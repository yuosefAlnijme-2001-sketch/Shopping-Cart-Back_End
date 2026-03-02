const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams عشان productId يجي من route

const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setProductId,
  createFilterObj,
} = require("../services/reviewServices");

const {
  CreateValidateReview,
  GetValidateReview,
  UpdateValidateReview,
  DeleteValidateReview,
} = require("../utils/validator/reviewValidation");
const authServices = require("../services/authServices");
// GET all reviews (optionally filtered by product)
router
  .route("/")
  .get(authServices.protect,createFilterObj, getReviews)
  .post(authServices.protect, setProductId, CreateValidateReview, createReview);

// CRUD for specific review
router
  .route("/:id")
  .get(authServices.protect,GetValidateReview, getReview)
  .put(authServices.protect,UpdateValidateReview, updateReview)
  .delete(authServices.protect,DeleteValidateReview, deleteReview);

module.exports = router;
