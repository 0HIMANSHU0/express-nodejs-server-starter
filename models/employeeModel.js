const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your Name"],
      maxLength: [30, "Name cannot exceed 30 Characters"],
      minLenght: [5, "Name Should have more than 5 Characters"],
    },
    phone: {
      type: String,
      required: [true, "Please Enter a Valid Mobile Number"],
    },
    countryCode: {
      type: String,
      required: [true, "Please Provide the Contry code"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email ID"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a Vaild Email"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
    },
    image: {
      type: String,
      default:
        "https://api.drarchikadidi.com/public/images/image-1731643357647-384507168.png",
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLenght: [8, "Password Should be greateer than 8 Characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: [true, "Please Enter the Employee Role"],
      default: "employee",
    },
    bio: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    permissionType: {
      type: String,
      enum: ["default", "custom"],
      default: "default",
    },
    last_login: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// Method to Always Hash the Employee Password Before Saving in MongoDB
employeeSchema.pre("save", async function (next) {
  // Condition to check if the Password is not Change or Modified (Doesn't Hash the Already Hashed Password)
  if (!this.isModified("password")) {
    next();
  }
  // If the Password is Change or Modifed Updated New Hash Password
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
employeeSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Forget Password Token
employeeSchema.methods.getForgetPasswordToken = function () {
  // Generating Reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and Adding forgotPasswordToken to the employee Schema
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.forgotPasswordTokenExpiry = Date.now() + 5 * 60 * 1000; // Expire after 5 mins
  return resetToken;
};

const Employee =
  mongoose.model.employees || mongoose.model("employees", employeeSchema);
module.exports = Employee;
