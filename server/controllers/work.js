const { StatusCodes } = require("http-status-codes");
const Work = require("../models/Work");
const { BadRequestError, NotFoundError } = require("../errors");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

module.exports.requestService = async (req, res) => {
  const workData = await Work.create({ ...req.body, customer: req.userId });
  /***** send websocket */

  res.status(StatusCodes.OK).json({
    success: true,
    data: workData,
    msg: "Service has been requested successfully!",
  });
};

module.exports.rejectRequest = async (req, res) => {
  const work = await Work.findByIdAndUpdate(req.params.id, {
    status: "rejected",
  });

  if (!work) {
    throw new BadRequestError("Invalid request!");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: work,
    msg: "Service request has been closed!",
  });
};

module.exports.acceptRequest = async (req, res) => {
  const work = await Work.findByIdAndUpdate(
    req.params.id,
    { status: "accepted" },
    { runValidators: true, new: true }
  );

  if (!work) {
    throw new BadRequestError("Invalid request!");
  }

  // create conversation channel
  let conversation = await Conversation.create({
    servicer: work.servicer,
    customer: work.customer,
  });
  conversation = await conversation.populate("messages");

  // emit socket to both parties

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      work,
      conversation,
    },
    msg: "Service request has been accepted!",
  });
};

module.exports.getAllConversations = async (req, res) => {
  const role = req.params.role === "service-provider" ? "servicer" : "customer";
  const conversations = await Conversation.find({
    [role]: req.userId,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: conversations,
    msg: "Found Conversations!",
  });
};

module.exports.getConversation = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id).populate(
    "messages"
  );

  if (!conversation) {
    throw new NotFoundError("Conversation not found!");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: conversation,
    msg: "Found conversation!",
  });
};

module.exports.sendMessage = async (req, res) => {
  const { message, receiver } = req.body;

  const msg = await Message.create({
    message,
    receiver,
    sender: req.userId,
    conversationId: req.params.id,
  });
  // update conversations recent
  await Conversation.findByIdAndUpdate(
    req.params.id,
    { recent: msg._id },
    { runValidators: true, new: true }
  );

  // send websocket

  res.status(StatusCodes.OK).json({
    success: true,
    data: msg,
    msg: "Message sent successfully!",
  });
};
