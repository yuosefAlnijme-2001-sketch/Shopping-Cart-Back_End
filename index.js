const path = require("path");
require("dotenv").config({ path: "./config.env" });
const express = require("express");

const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const DBConnection = require("./config/dbConnection");
const GlobelError = require("./middlewares/errorMeddlieware");
const ApiError = require("./utils/ApiError");
const router = require("./router");
const { webhookCheckout } = require("./services/orderServices");
// Connection DB
DBConnection();
const cloudinary = require("./utils/cloudinary");
const app = express();

app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.options("*", cors());

app.use(compression());

// CheckOut WebHook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);
app.use(express.json());
app.use("/api/v1", router);
if (process.env.NODE_ENV === "developments") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
} else {
  console.log(`Mode : ${process.env.NODE_ENV}`);
}

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});
// Get error handling middleware
app.use(GlobelError);
const Port = process.env.PORT || 5000;

const server = app.listen(Port, () => {
  console.log(`Server Running with server ${Port}`);
});

// خاصه بل ايرور خارج ال express
process.on("unhandledRejection", (err) => {
  // consloe.error(`UnhandledRejection Error : ${err.name} | ${err.message}`);
  // بتوقف السيرفر و بظهر الخطا يلي خارج ال express
  server.close(() => {
    process.exit(1);
  });
});
