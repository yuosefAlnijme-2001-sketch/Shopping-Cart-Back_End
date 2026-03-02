const express = require("express");

const AuthRouter = require("./authRouter");
const UserRouter = require("./userRouter");
const CategoryRouter = require("./categoryRouter");
const BrandRouter = require("./brandRouter");
const ProductRouter = require("./productRouter");
const discountRoutes = require("./discountRoutes");
const addressRoutes = require("./addressRouter");
const wishlistRoutes = require("./wishlistRouter");
const reviewRoutes = require("./reviewRouter");
const cartRoutes = require("./cartRoutes");
const sliderRoutes = require("./sliderRouter");
const orderRoutes = require("./orderRouter");
const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/category", CategoryRouter);
router.use("/brand", BrandRouter);
router.use("/product", ProductRouter);
router.use("/discounts", discountRoutes);
router.use("/address", addressRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/review", reviewRoutes);
router.use("/cart", cartRoutes);
router.use("/slider", sliderRoutes);
router.use("/order", orderRoutes);

module.exports = router;
