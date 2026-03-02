const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
// =============================

const User = require("../models/userModels");
const ApiError = require("../utils/ApiError");

/* =========================
   Helper: Generate Token
========================= */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY_SECRIPT, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/* =========================
   Register Service
========================= */
exports.registerService = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    },
  });
});

/* =========================
   Login Service
========================= */
exports.loginService = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });
  res.status(200).json({
    token,
    message: ` Welcome ${user.firstName}`,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
  });
});

// للتاكد من ان المستخدم سجل دخول او لا
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exeist , if exsit get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not login , please login first", 401));
  }
  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_KEY_SECRIPT);
  // 3) check if user exsist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exist",
        401,
      ),
    );
  }
  // 4) check if user change his password after token created
  if (currentUser.passwordchangeAt) {
    const passChangeGetTime = parseInt(
      currentUser.passwordchangeAt.getTime() / 1000,
      10,
    );
    if (passChangeGetTime > decoded.iat) {
      // Password changed after token create
      return next(
        new ApiError(
          "User recently change his password , please login again...",
          401,
        ),
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access role
    // 2) access user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });
