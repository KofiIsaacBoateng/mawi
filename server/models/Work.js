const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema(
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

    scheduled: {
      type: Date,
      default: Date.now(),
    },

    jobDescription: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Work", WorkSchema);
