const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User Required"],
    },
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
    taxPrise: {
      // الضريبه
      type: Number,
      default: 0,
    },
    shoppingPrice: {
      // مصاريف الشحن
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    shippingAddress: {
      details: String,
      city: String,
      phone: String,
      postalCode: String,
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      // هل تم الدفع او لا
      type: Boolean,
      default: false,
    },
    paidAt: {
      // وقت الدفع
      type: Date,
    },
    isDelivered: {
      // هل هوا وصل ام لا لما يكون كاش
      type: Boolean,
      default: false,
    },
    // وقت الدفع وقت الكاش
    deliveredAt: Date,
  },
  { timestamps: true },
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email phone avatar",
  }).populate({ path: "cartItems.product", select: "name image" });
  next();
});
const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
