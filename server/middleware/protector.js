const { Forbidden, UnAuthorizedError } = require("../errors");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (!authorization) {
    throw new UnAuthorizedError(
      "You are not registered yet. Please try again."
    );
  }

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  }

  if (!token) {
    throw new UnAuthorizedError(
      "You are not registered yet. Please try again."
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) {
    throw new Forbidden(
      "Invalid token. Please register or verify phone number."
    );
  }

  /***** placeholder => when user resets passcode, make sure to log all other accounts out to verify again*/

  // Grant user access to protected routes
  req.userId = decoded._id;
  next();
};
