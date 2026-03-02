const asyncHandler = require("express-async-handler");

const User = require("../models/userModels");
const ApiError = require("../utils/ApiError");

exports.addToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true },
  ).populate("wishlist");

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    status: true,
    success: "Add product to wishList",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user.wishlist.some((id) => id.toString() === req.params.productId)) {
    return next(new ApiError("Product not in wishlist", 404));
  }

  user.wishlist.pull(req.params.productId);
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist",
    data: user.wishlist,
  });
});

exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    return next(
      new ApiError(`Not Found any wishlist for this user ${user.name}`),
    );
  }
  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

// exports.toggleWishlist = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   const productId = req.body.productId;

//   const exists = user.wishlist.some((id) => id.toString() === productId);

//   if (exists) {
//     // ❌ remove
//     user.wishlist.pull(productId);
//   } else {
//     // ✅ add
//     user.wishlist.push(productId);
//   }

//   await user.save();

//   res.status(200).json({
//     status: "success",
//     message: exists
//       ? "Product removed from wishlist"
//       : "Product added to wishlist",
//     data: user.wishlist,
//   });
// });

exports.toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const productId = req.body.productId;

  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    user.wishlist.pull(productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  // 🔹 populate before sending response
  await user.populate({
    path: "wishlist",
    select: "name description image originalPrice discountedPrice stock rating",
  });

  res.status(200).json({
    status: "success",
    message: exists
      ? "Product removed from wishlist"
      : "Product added to wishlist",
    data: user.wishlist,
  });
});
