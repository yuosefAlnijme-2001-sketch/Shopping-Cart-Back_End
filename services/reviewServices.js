// reviewServices.js
const Review = require("../models/reviewModel");
const Factory = require("./handelFactor");

// Middleware for setting product in body if not provided
exports.setProductId = (req, res, next) => {
  // product
  if (!req.body.product && req.params.productId) {
    req.body.product = req.params.productId;
  }

  // user 🔥 (هاي أهم اضافة)
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};

// Middleware to filter by product
exports.createFilterObj = (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  req.filterObject = filter;
  next();
};

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);

    // نعمل populate للـ user مباشرة بعد الإنشاء
    await review.populate({ path: "user", select: "firstName avatar" });

    res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};
// CRUD
exports.getReviews = Factory.getAll(Review);
// exports.createReview = Factory.createOne(Review);
exports.getReview = Factory.getOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
