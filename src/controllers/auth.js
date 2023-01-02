const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllPokemons = async (req, res) => {
  const pokemons = await Pokemon.find()
    .sort({ order: 1 })
    .populate({
      path: "types",
      populate: {
        path: "type",
        select: { name: 1, color: 1, _id: 0 },
      },
    })
    .populate({
      path: "evolution_chain",
      select: { name: 1, imgSrc: 1, order: 1, _id: 0 },
    })
    .exec();
  if (!pokemons) {
    return res.status(404).json("pokemons have not been founded");
  }
  pokemons.reduce((prev, curr) => {
    curr.types = curr.types.sort((prev, curr) => prev.slot - curr.slot);
    return [...prev, curr];
  }, []);
  return res.json(pokemons);
};

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

const addEvolutionChainToPokemon = async (req, res) => {
  const { name } = req.params;
  const { evolutionChain } = req.body;
  const pokemon = await Pokemon.findOne({ name }).exec();
  if (!pokemon) {
    return res.status(404).json("pokemon has not been founded");
  }
  for (let i = 0; i < evolutionChain.length; i += 1) {
    let target = await Pokemon.findOne({ name: evolutionChain[i] }).exec();
    if (!target) continue;
    pokemon.evolution_chain.addToSet(target._id);
    await pokemon.save();
  }
  return res.json(pokemon);
};

const deleteAllPokemons = async (req, res) => {
  await Pokemon.deleteMany().exec();
  return res.json("deleted");
};

module.exports = {
  register,
  login
};
