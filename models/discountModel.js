const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال اسم الخصم"],
      trim: true,
    },
    percentage: {
      type: Number,
      required: [true, "الرجاء إدخال نسبة الخصم"],
      min: [1, "الخصم يجب أن يكون أكبر من 0%"],
      max: [100, "الخصم لا يمكن أن يكون أكثر من 100%"],
    },
    expireDate: {
      type: Date,
      required: [true, "الرجاء إدخال تاريخ انتهاء الخصم"],
    },
    usersUsed: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);
const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
