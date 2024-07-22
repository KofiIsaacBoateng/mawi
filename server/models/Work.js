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

    title: {
      type: String,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    bid: {
      type: {
        budget: String,
        negotiable: Boolean,
      },
    },

    dateTime: {
      type: Date,
      default: Date.now(),
    },

    jobLocation: { type: [Number], select: false },

    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "completed"],
        message: "{VALUE} is an invalid status",
      },
      default: "pending",
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkSchema.pre(/^find/, function (next) {
  this.populate("customer");
  this.populate("servicer");
  next();
});

module.exports = mongoose.model("Work", WorkSchema);
