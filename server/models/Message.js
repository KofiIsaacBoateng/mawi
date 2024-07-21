const { Schema, SchemaTypes, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    sender: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: SchemaTypes.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    toObject: { virtuals: true },
  }
);

MessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "name photo",
  });
  this.populate({
    path: "receiver",
    select: "name photo",
  });
  next();
});

module.exports = model("Message", MessageSchema);
