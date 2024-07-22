const { StatusCodes } = require("http-status-codes");
const Work = require("../models/Work");
const { BadRequestError, NotFoundError } = require("../errors");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getServicerFeed = (status) => async (req, res) => {
  let work = await Work.find({ servicer: req.userId, status }).select(
    "+jobLocation"
  );

  res.status(StatusCodes.OK).json({
    success: true,
    data: work,
    msg: "Found feed data!",
  });
};

module.exports.getWork = getServicerFeed("accepted");
module.exports.getIncomingWork = getServicerFeed("pending");
module.exports.getCompletedWork = getServicerFeed("completed");

module.exports.requestService = async (req, res) => {
  const workData = await Work.create({
    ...req.body,
    jobLocation: [req.body.jobLocation[0] * 1, req.body.jobLocation[1] * 1],
    customer: req.userId,
  });

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
    workId: req.params.id,
  });
  conversation = await conversation.populate("messages");

  // emit socket to both parties

  res.status(StatusCodes.OK).json({
    success: true,
    data: work,
    msg: "Service request has been accepted!",
  });
};

module.exports.completeJob = async (req, res) => {
  const work = await Work.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { runValidators: true, new: true }
  );

  if (!work) {
    throw new BadRequestError("Invalid request!");
  }

  // emit socket to both parties

  res.status(StatusCodes.OK).json({
    success: true,
    data: work,
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
  const { message, receiver, conversationId } = req.body;

  let msg = await Message.create({
    message,
    receiver,
    sender: req.userId,
    conversationId,
  });

  msg = await msg.populate("receiver sender");
  // update conversations recent
  await Conversation.findByIdAndUpdate(
    conversationId,
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
