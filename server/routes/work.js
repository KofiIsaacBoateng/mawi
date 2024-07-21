const express = require("express");
const {
  requestService,
  rejectRequest,
  acceptRequest,
  getAllConversations,
  getConversation,
  sendMessage,
} = require("../controllers/work");
const protector = require("../middleware/protector");
const router = express.Router();

// rubber wearable
router.use(protector);

//service
router.route("/send").post(requestService);
router.route("/reject/:id").patch(rejectRequest);
router.route("/accept/:id").patch(acceptRequest);

// conversation channels
router.route("/messaging/convos/:role").get(getAllConversations);
router.route("/messaging/convo/:id").get(getConversation);
router.route("/messaging/send-message/:id").post(sendMessage);

module.exports = router;
