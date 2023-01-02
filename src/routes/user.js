const express = require("express");
const { setAvatar } = require("../controllers/user");

const router = express.Router();

router.put("/avatar", setAvatar);

module.exports = router;
