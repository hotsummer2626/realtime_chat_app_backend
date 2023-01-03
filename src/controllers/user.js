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

const getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find().exec();
    users = users.map((user) => {
      delete user._doc.password;
      return user
    });
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { setAvatar, getAllUsers };
