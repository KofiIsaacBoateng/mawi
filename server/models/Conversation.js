const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },

    servicer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },

    recent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ConversationSchema.virtual("messages", {
  localField: "_id",
  foreignField: "conversationId",
  ref: "Message",
});

ConversationSchema.pre(/^find/, function (next) {
  this.populate({ path: "customer", select: "name photo" });
  this.populate({ path: "servicer", select: "name photo" });
  this.populate("recent");
});

module.exports = mongoose.model("Conversation", ConversationSchema);
