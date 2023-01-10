const express = require("express");
const { addMessage, getAllMessages } = require("../controllers/message");

const router = express.Router();

router.post("/", addMessage);
router.post("/:senderId/:receiverId", getAllMessages);

module.exports = router;
