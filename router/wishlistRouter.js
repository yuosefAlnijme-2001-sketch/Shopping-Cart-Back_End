const express = require("express");
const router = express.Router();
const {
  addToWishList,
  removeFromWishlist,
  getWishlist,
  toggleWishlist,
} = require("../services/wishlistServices");
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../utils/validator/wishlistValidation");

const authServices = require("../services/authServices");

router
  .route("/")
  // .post(authServices.protect, addToWishlistValidator, addToWishList)
  .get(authServices.protect, getWishlist);

router
  .route("/:productId")
  .delete(
    authServices.protect,
    removeFromWishlistValidator,
    removeFromWishlist,
  );

router.route("/").post(authServices.protect, toggleWishlist);
module.exports = router;
