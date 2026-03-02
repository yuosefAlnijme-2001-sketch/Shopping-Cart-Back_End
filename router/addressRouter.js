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
 * @access Privte
 */
router
  .route("/")
  .post(authServices.protect, addAddressValidation, addAddress)
  .get(authServices.protect, myAddressesValidation, myAddresses);

router
  .route("/:addressId")
  .get(authServices.protect, getAddressValidation, getAddress)
  .delete(authServices.protect, removeAddressValidation, removeAddress)
  .put(authServices.protect, updateAddressValidation, updateAddress);
module.exports = router;
