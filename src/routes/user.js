const express = require("express");
const { setAvatar, getAllUsers } = require("../controllers/user");

const router = express.Router();

router.get("/", getAllUsers);
router.put("/avatar", setAvatar);

module.exports = router;
