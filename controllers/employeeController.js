const Employee = require("../models/employeeModel");
const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

// Create a Employee
exports.createEmployee = catchAsyncErrors(async (req, res, next) => {
  console.log("The Create Employee Controller is Called");
  const {
    name,
    phone,
    countryCode,
    email,
    department,
    image,
    password,
    isVerfied,
    role,
    bio,
    status,
    permissionType,
    createdBy,
  } = req.body;

  console.log("The createEmployee Request Body", name);
  const employee = await Employee.create({
    name,
    phone,
    countryCode,
    email,
    department,
    image,
    password,
    isVerfied,
    role,
    bio,
    status,
    permissionType,
    createdBy,
  });

  const token = await employee.getJWTToken();

  res.status(201).json({
    success: true,
    message: "Employee is Created Successfully",
    token,
  });
});

// Login Employee
exports.loginEmployee = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking if the User is Given Email and Password Both

  console.log("The email and password value is:", req.body);
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Your Email & Password", 400));
  }

  const employee = await Employee.findOne({ email }).select("+password");
  console.log("employee password", employee);
  if (!employee) {
    return next(new ErrorHandler("Invalid Email or Password!!", 401));
  }

  const isPasswordMatched = await employee.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!!", 401));
  }

  //   const token = employee.getJWTToken();

  //   res.status(201).json({
  //     success: true,
  //     message: "Employee is Login Successfully",
  //     token,
  //   });
  sendToken(employee, 200, res);
});

// Get All Employee
exports.getAllEmployee = catchAsyncErrors(async (req, res, next) => {
  const allEmployees = await Employee.find({});

  if (!allEmployees) {
    return next(new ErrorHandler("No Employees Found", 400));
  }

  res.status(200).json({
    success: true,
    message: "All Employees Fetched Successfully",
    allEmployees,
  });
});

// Logout Employee
exports.logoutEmployee = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

// Forget Password Employee
exports.forgotPasswordEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findOne({ email: req.body.email });

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 404));
  }

  // getForgetPasswordToken
  const resetToken = employee.getForgetPasswordToken();
  await employee.save({ validateBeforeSave: false });

  try {
    res.status(200).json({
      success: true,
      message: "Forgot Password reset Token Generated Succssfully",
      resetToken,
    });
  } catch (error) {
    employee.forgotPasswordToken = undefined;
    employee.forgotPasswordTokenExpiry = undefined;

    await employee.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password Employee
exports.resetPasswordEmployee = catchAsyncErrors(async (req, res, next) => {
  const resetToken = req.params.token;

  console.log("The Token value is: ", resetToken);
  // Creating Token Hash Received from the Employee
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const employee = await Employee.findOne({
    forgotPasswordToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!employee) {
    return next(
      new ErrorHandler(
        "Reset Password Token is Invalid or has been Expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Doesn't Match", 404));
  }

  employee.password = req.body.password;
  employee.forgotPasswordToken = undefined;
  employee.forgotPasswordTokenExpiry = undefined;

  await employee.save();
  sendToken(employee, 200, res);
});
