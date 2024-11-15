const Employee = require("../models/employeeModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

// Using Cookies
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let { token } = req.cookies;
  console.log("Cookie Token value is:", token);

  if (!token) {
    return next(new ErrorHandler("Please Login to Access this Resources", 401));
  }

  let decodedData = await jwt.verify(token, process.env.JWT_SECRET);
  console.log("The decodedData value is:", decodedData);

  req.employee = await Employee.findById(decodedData.id);
  next();
});

// Using Headers
exports.isAuthenticatedUserUsingHeader = (active = true) =>
  catchAsyncErrors(async (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization) {
      let authArr = req.headers.authorization.split(" ");

      if (authArr.length >= 2 && authArr[0] === "Bearer") {
        token = authArr[1];
      } else {
        if (active) {
          return next(
            new ErrorHandler("Please Login to access to this resource", 401)
          );
        }
      }
    }

    if (!token || token == "null" || token == " " || token == "") {
      if (active) {
        return next(
          new ErrorHandler("Please Login to access to this resource", 401)
        );
      }
    }
    if (token) {
      const decodeddata = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodeddata.id);
    }

    next();
  });

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.employee.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.employee.role} is not allowed to Access this Resource`,
          403
        )
      );
    }
    next();
  };
};
