const express = require("express");
const {
  createEmployee,
  loginEmployee,
  getAllEmployee,
  logoutEmployee,
  forgotPasswordEmployee,
  resetPasswordEmployee,
} = require("../controllers/employeeController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// Route to create an Employee
router.route("/employee/create").post(createEmployee);
// Route to Login Employee
router.route("/employee/login").post(loginEmployee);
// Fetch All Employees
router
  .route("/employee/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllEmployee);
// Route for Logout Employee
router.route("/employee/logout").get(logoutEmployee);
// Route for Forgot Password Employee
router.route("/employee/forgetpassword").get(forgotPasswordEmployee);
// Route for Reset Password
router.route("/employee/resetpassword/:token").put(resetPasswordEmployee);

module.exports = router;
