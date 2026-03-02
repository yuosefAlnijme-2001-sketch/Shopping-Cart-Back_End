const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    colors: [String],
    sizes: [
      {
        type: String,
        enum: ["صغير", "متوسط", "كبير", "كبير جدًا"],
        default: "صغير",
      },
    ],
    image: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    stock: { type: Number, default: 0 },
    ratingsAverage: { type: Number, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "out of stock", "new"],
      default: "available",
    },
    quntity: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "brand",
    select: "name",
  });
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
module.exports = mongoose.model("Product", productSchema);
