const asyncHandler = require("express-async-handler");

const Factory = require("./handelFactor");
const Product = require("../models/productModel");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware");
const cloudinary = require("../utils/cloudinary");

exports.uploadProductSingleImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      async (error, result) => {
        if (error) {
          return next(new Error("Image upload failed"));
        }
        req.body.image = result.secure_url;
        next();
      },
    );

    result.end(req.file.buffer);
  } else {
    next();
  }
});

// @ desc Create Product
// @router post /api/v1/product
// @access Privet
exports.CreateProduct = Factory.createOne(Product);

// @desc GET Product
// @router Get /api/v1/product
// @access Public
exports.getProducts = Factory.getAll(Product);

// desc Get Specific Product by id
// @router Get /api/v1/categorey/productId
// @access Public
exports.GetProduct = Factory.getOne(Product);

// desc Update Product by id
// @router Put /api/v1/product/productId
// @access Public
exports.UpdateProduct = Factory.updateOne(Product);
// desc Delete Product by id
// @router Put /api/v1/product/productId
// @access Public
exports.deleteProduct = Factory.deleteOne(Product);

// لجلب المنتجات المشابه لهاد المنتج بناءا على Category
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      status: "success",
      results: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// عشان تجيب كل المنتجات التابعه لتصنيف معين
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const filter = {};
    if (req.params.categoryId) filter.category = req.params.categoryId;

    const products = await Product.find(filter);

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};
