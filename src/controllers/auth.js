const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userCheck = await User.findOne({ username }).exec();
    if (userCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email }).exec();
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    user._doc.token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user._doc.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).exec();
    if (!user)
      return res.json({
        msg: "Incorrect username, email or password",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({
        msg: "Incorrect username, email or password",
        status: false,
      });
    user._doc.token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user._doc.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
