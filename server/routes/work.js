const express = require("express");
const {
  requestService,
  rejectRequest,
  acceptRequest,
  getAllConversations,
  getConversation,
  sendMessage,
} = require("../controllers/work");
const router = express.Router();

// request service
router.route("/send").post(requestService);
// reject
router.route("/reject").patch(rejectRequest);
// accept
router.route("/accept").patch(acceptRequest);

// get all conversation
router.route("/messaging/convos/:role").get(getAllConversations);
// get a conversation
router.route("/messaging/convo/:id").get(getConversation);
// send message
router.route("/messaging/send-message").post(sendMessage);

module.exports = router;
