const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.SECRER_KEY);

const Factory = require("./handelFactor");
const ApiError = require("../utils/ApiError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModels");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // بدنا نجيب الكارت ونتاكد اذا كان موجود ولا لا
  // Get cart depend on CartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such with cart id ${req.params.cartId}`, 404),
    );
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }
  // Authorization
  if (cart.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not authorized", 403));
  }
  //   بدنا انجيب الكارت يلي بلاوردر ونتاكد اذا كان في الو خصم ولا لا
  // Get order price depend on cart price "Check if coupone applay"
  const cartPrice = cart.totalPriceAfterDiscound
    ? cart.totalPriceAfterDiscound
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //   After create order decriments Product Qut incremnt Product Sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          // قلل ال quantity
          // وزود ال Sold
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // Clear cart depend on CartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    data: order,
    status: "Success",
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

exports.getAllOrder = Factory.getAll(Order);
exports.getOrder = Factory.getOne(Order);
// exports.createCashOrder = asyncHandler(async (req, res, next) => {
//   const taxPrice = 0;
//   const shippingPrice = 0;

//   // 1. Get cart
//   const cart = await Cart.findById(req.params.id);

//   if (!cart) {
//     return next(
//       new ApiError(`There is no cart with id ${req.params.id}`, 404)
//     );
//   }

//   if (cart.cartItems.length === 0) {
//     return next(new ApiError("Cart is empty", 400));
//   }

//   // Authorization
//   if (cart.user.toString() !== req.user._id.toString()) {
//     return next(new ApiError("You are not authorized", 403));
//   }

//   // 2. Calculate price
//   const cartPrice = cart.totalPriceAfterDiscount
//     ? cart.totalPriceAfterDiscount
//     : cart.totalCartPrice;

//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

//   // 3. Create order
//   const order = await Order.create({
//     user: req.user._id,
//     cartItems: cart.cartItems,
//     shippingAddress: req.body.shippingAddress,
//     totalOrderPrice,
//   });

//   // 4. Update products
//   const bulkOption = cart.cartItems.map((item) => ({
//     updateOne: {
//       filter: { _id: item.product },
//       update: {
//         $inc: {
//           quantity: -item.quantity,
//           sold: +item.quantity,
//         },
//       },
//     },
//   }));

//   await Product.bulkWrite(bulkOption);

//   // 5. Clear cart
//   await Cart.findByIdAndDelete(req.params.id);

//   res.status(201).json({
//     status: "success",
//     data: order,
//   });
// });

// @ desc Update order
// @router put /api/v1/order/:id/pay
// @access Protected/Admin

exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no a order with id : ${req.params.id}`, 404),
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @ desc Update orderDelever
// @router put /api/v1/order/:id/deliver
// @access Protected/Admin

exports.updateOrderDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no a order with id : ${req.params.id}`, 404),
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();
  res.status(200).json({ status: "success", data: updateOrder });
});

// @desc    Get checkout setion from stripe and send is as res
// @route   GET /api/orders/checkout-session/cartId
// @access  Private/User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // بدنا نجيب الكارت ونتاكد اذا كان موجود ولا لا
  // Get cart depend on CartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such with cart id ${req.params.cartId}`, 404),
    );
  }
  if (cart.cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }
  // Authorization
  if (cart.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not authorized", 403));
  }
  //   بدنا انجيب الكارت يلي بلاوردر ونتاكد اذا كان في الو خصم ولا لا
  // Get order price depend on cart price "Check if coupone applay"
  const cartPrice = cart.totalPriceAfterDiscound
    ? cart.totalPriceAfterDiscound
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3 Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: `Order by ${req.user.firstName + " " + req.user.lastName} `,
          },
        },
        quantity: 1,
      },
    ],

    success_url: `${req.protocol}://${req.get("host")}/dashpord/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,

    customer_email: req.user.email,

    client_reference_id: cart._id.toString(),

    metadata: {
      address: JSON.stringify(req.body.shippingAddress),
    },
  });
  // Send session to res
  res.status(200).json({
    status: "success",
    session,
  });
});

const createOrderFromSession = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = JSON.parse(session.metadata.address);
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  if (!cart) return;
  const user = await User.findOne({ email: session.customer_email });

  // Create Order Card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });
  //   After create order decriments Product Qut incremnt Product Sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          // قلل ال quantity
          // وزود ال Sold
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ أهم event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 🔥 هون تنشئ الأوردر
    await createOrderFromSession(session);
  }

  res.status(200).json({ received: true });
};
