const { StatusCodes } = require("http-status-codes");
const Work = require("../models/Work");
const JobRequest = require("../models/ServiceRequest");

module.exports.requestService = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Service has been requested successfully!",
  });
};

modules.rejectRequest = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Service request has been closed!",
  });
};

module.exports.closeRequest = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Service request has been closed!",
  });
};

module.exports.createCommunicationChannel = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "communication channel initiated!",
  });
};

module.exports.sendMessage = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "communication channel initiated!",
  });
};
