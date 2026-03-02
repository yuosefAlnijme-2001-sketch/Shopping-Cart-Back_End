const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");
const calcTotalCartPrice = require("../utils/calcTotalCartPrice");

// @desc      Add product to cart
// @route     POST /api/v1/cart
// @access    Private/User
exports.addProductsToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, size } = req.body;

  // ✅ اجلب بيانات المنتج من قاعدة البيانات
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name image price",
  });

  if (!cart) {
    // ✅ أنشئ سلة جديدة
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          size,
          price: product.discountedPrice,
          quantity: 1,
        },
      ],
    });
  } else {
    // ✅ تحقق إذا كان المنتج موجود بنفس اللون
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product._id.toString() === productId &&
        item.color === color &&
        item.size === size,
    );

    if (productIndex > -1) {
      // ✅ إذا موجود، زد الكمية
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // ✅ إذا مش موجود، أضفه
      cart.cartItems.push({
        product: productId,
        color,
        size,
        price: product.discountedPrice,
        quantity: 1,
      });
    }
  }

  await calcTotalCartPrice(cart);

  res.status(200).json({
    status: "success",
    message: "Products Added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name image ratingsAverage brand category discountedPrice",
    populate: [
      { path: "brand", select: "name -_id", model: "Brand" },
      { path: "category", select: "name -_id", model: "Category" },
    ],
  });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user is : ${req.user._id}`, 404),
    );
  }

  res.status(200).json({
    status: "success",
    numberOfCartItem: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Remove product from cart
// @route     DELETE /api/v1/cart/:itemId
// @access    Private/User
exports.removeCartProduct = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: itemId } },
    },
    { new: true },
  ).populate({
    path: "cartItems.product",
    select: "name image ratingsAverage brand category discountedPrice",
    populate: [
      { path: "brand", select: "name -_id", model: "Brand" },
      { path: "category", select: "name -_id", model: "Category" },
    ],
  });
  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc      Clear logged user cart
// @route     DELETE /api/v1/cart
// @access    Private/User
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res
    .status(204)
    .json({ status: "success", message: "Delete All product fro cart" });
});

// @desc      Update product quantity
// @route     Put /api/v1/cart/:itemId
// @access    Private/User
exports.updateCartProductCount = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  // 1) Check if there is cart for logged user
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "cartItems.product",
      select: "name image ratingsAverage brand category ",
      populate: { path: "brand", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "cartItems.product",
      select: "name image ratingsAverage brand category",
      populate: { path: "category", select: "name -_id", model: "Category" },
    });
  if (!cart) {
    return next(
      new ApiError(`No cart exist for this user: ${req.user._id}`, 404),
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId,
  );

  if (itemIndex > -1) {
    const productItem = cart.cartItems[itemIndex];
    productItem.quantity = quantity;
    cart.cartItems[itemIndex] = productItem;
  } else {
    return next(
      new ApiError(`No Product Cart item found for this id: ${itemId}`),
    );
  }
  // Calculate total cart price
  await calcTotalCartPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
