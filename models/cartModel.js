const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
        size: {
          type: String,
          enum: ["صغير", "متوسط", "كبير", "كبير جدًا"],
        },
      },
    ],

    totalCartPrice: Number,
    totalPriceAfterDiscound: Number,
    coupon: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", CartSchema);
