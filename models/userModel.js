const mongoose = require("mongoose");
const validator = require("validator");
const commonSchema = require("./CommonModel");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first Name is requied.'],
      //  trim: true,
      default: ''
    },
    lastName: {
      type: String,
      required: [true, 'last Name is requied.'],
      //  trim: true,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email is requied.'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
      default: ''
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      enum: [true, false],
      required: true,
      default: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, 'gender is required.'],
      trim: true,
      default: ''
    },
    address: {
      type: String,
      required: true,
      default: ''
    },
    profilePicture: {
      type: String,
      default: '',
      required: false
    },
    token: {
      type: String,
      default: '',
      required: false
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required: [true, 'Status is required.'],
      default: 'Active'
    },
  },
  { timestamps: true }
);

userSchema.add(commonSchema);

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
