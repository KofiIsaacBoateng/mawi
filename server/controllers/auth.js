const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const signToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports.register = async (req, res) => {
  const { email, password, name, role, mobile } = req.body;

  if (!email || !password || !name || !role || !mobile) {
    throw new BadRequestError(
      "Please provide an email, password, name, and mobile"
    );
  }

  const user = await User.create({ ...req.body });

  // create token
  const token = signToken(user._id);
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
    token,
    msg: "User account created successfully!",
  });
};

module.exports.login = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw new BadRequestError("Please provide an email and password!");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthorizedError("Invalid email or password");
  }

  const validPassword = await user.comparePassword(password, user.password);
  if (!validPassword) {
    throw new UnAuthorizedError("Invalid email or password!");
  }

  const token = signToken(user._id);
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
    token,
    msg: "Login successful!",
  });
};
