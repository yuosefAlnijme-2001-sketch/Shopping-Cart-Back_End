const asyncHandler = require("express-async-handler");

const Discount = require("../models/discountModel");
const Factory = require("./handelFactor");
const Coupon = require("../models/discountModel");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/ApiError");
const calcTotalCartPrice = require("../utils/calcTotalCartPrice");

// @ desc Create Discount
// @router post /api/v1/discound
// @access Privet
exports.CreateDiscound = Factory.createOne(Discount);

// @desc GET Discount
// @router Get /api/v1/discound
// @access Public
exports.getDiscounds = Factory.getAll(Discount);

// desc Get Specific Discount by id
// @router Get /api/v1/discound/discoundId
// @access Public
exports.GetDiscound = Factory.getOne(Discount);

// desc Update Discount by id
// @router Put /api/v1/discound/discoundId
// @access Public
exports.UpdateDiscound = Factory.updateOne(Discount);
// desc Delete Discount by id
// @router Put /api/v1/discound/discoundId
// @access Public
exports.deleteDiscound = Factory.deleteOne(Discount);

// @desc      Apply coupon logged user cart
// @route     PUT /api/v1/cart/applyCoupon
// @access    Private/User
exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const { couponName } = req.body;

  // 1) تحقق إذا عند المستخدم Cart
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name image ratingsAverage brand category discountedPrice",
    populate: [
      { path: "brand", select: "name -_id", model: "Brand" },
      { path: "category", select: "name -_id", model: "Category" },
    ],
  });
  if (!cart) {
    return next(new ApiError("Your cart is empty", 400));
  }

  // 2) Get coupon based on its unique name and expire > date.now
  const coupon = await Coupon.findOne({
    name: couponName,
    expireDate: { $gt: Date.now() },
  });
  if (!coupon) {
    cart.totalPriceAfterDiscound = undefined;
    cart.coupon = undefined;
    await cart.save();
    return next(new ApiError("Coupon is invalid or has expired", 400));
  }

  // 3) احسب السعر بعد الخصم
  const totalPrice = await calcTotalCartPrice(cart);
  const totalAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.percentage) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscound = totalAfterDiscount;
  cart.coupon = coupon.name;

  await cart.save();

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    coupon: coupon.name,
    data: cart,
  });
});
