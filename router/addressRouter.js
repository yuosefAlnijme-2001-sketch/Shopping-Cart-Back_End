const express = require("express");
const router = express.Router();

const {
  addAddress,
  removeAddress,
  getAddress,
  myAddresses,
  updateAddress,
} = require("../services/addAdressServices");

const {
  addAddressValidation,
  getAddressValidation,
  removeAddressValidation,
  myAddressesValidation,
  updateAddressValidation,
} = require("../utils/validator/addressValidation");

const authServices = require("../services/authServices");

/**
 * @desc  Create Address
 * @route  POST /api/v1/address
 * @access Private/User
 */

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    addAddressValidation,
    addAddress,
  )
  .get(
    authServices.protect,
    authServices.allowedTo("user"),
    myAddressesValidation,
    myAddresses,
  );

router
  .route("/:addressId")
  .get(
    authServices.protect,
    authServices.allowedTo("user"),
    getAddressValidation,
    getAddress,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user"),
    removeAddressValidation,
    removeAddress,
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateAddressValidation,
    updateAddress,
  );

module.exports = router;
