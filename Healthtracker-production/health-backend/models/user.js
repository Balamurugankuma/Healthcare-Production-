const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar: {
  type: String,
  default: "",
},

  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  phone: String,
  dateOfBirth: String
},
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
