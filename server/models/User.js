const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      minLength: [3, "First names must be at least 3 characters long"],
      maxLength: [30, "First names must not exceed 30 characters"],
    },

    title: {
      type: String,
    },

    about: {
      type: String,
    },

    mobile: {
      type: String,
      unique: false,
      default: "",
    },

    email: {
      type: String,
      required: true,
      validator: [validator.isEmail, "Email is invalid!"],
      unique: true,
    },

    photo: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["service-provider", "customer"],
        message: "{VALUE} is not a valid role!",
      },
    },

    location: [Number],
  },

  {
    timestamps: true,
  }
);

UserSchema.index({ title: 1, about: 1, name: 1 });
UserSchema.index({ location: "2dsphere" });

// encrypt password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**** model interface methods */
// verify password
UserSchema.methods.comparePassword = async function (
  candidatePassword,
  dbHashPassword
) {
  return await bcrypt.compare(candidatePassword, dbHashPassword);
};

module.exports = mongoose.model("User", UserSchema);
