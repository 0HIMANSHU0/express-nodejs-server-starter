const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const compression = require("compression");
const errorMiddleware = require("./middlewares/error");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());

// Routes Import
const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/V1", employeeRoutes);
// Middle ware for Errors
app.use(errorMiddleware);

module.exports = app;
