// Creating Token and Saving in Cookies

const sendToken = (employee, statusCode, res) => {
  const token = employee.getJWTToken();

  // Options for Cookies
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    employee,
    token,
  });
};

module.exports = sendToken;
