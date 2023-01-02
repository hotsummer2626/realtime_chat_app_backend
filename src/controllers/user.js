const User = require("../models/user");

const setAvatar = async (req, res, next) => {
  try {
    const { userId, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).exec();
    if (!user) return res.json({ msg: "User not existed", status: false });
    delete user._doc.password;
    return res.json({ user, status: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { setAvatar };
