import mongoose from "mongoose";
const { isEmail } = require("validator");
const Schema = mongoose.Schema;

const auth = new Schema(
  {
    firstName: { type: String, required: true, min: 3 },
    lastName: { type: String, required: true, min: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: isEmail,
    },
    password: { type: String, required: true, min: 6 },
    manageOTP: {
      otp: { type: Number },
      otpDate: { type: Number },
    },
  },
  { timestamps: true }
);

const userAuth = mongoose.model("user", auth);
export default userAuth;
