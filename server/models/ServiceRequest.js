const mongoose = require("mongoose");

const JobRequest = new mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },

    servicer: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "{VALUE} is an invalid status",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkSchema.pre(/^find/, function () {
  this.populate("customer");
  this.populate("servicer");
});

module.exports = mongoose.model("request", JobRequest);
