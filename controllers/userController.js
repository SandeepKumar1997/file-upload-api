const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill in the details properly" });
  }
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(500).json({ message: "User already exists !" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (user) {
    return res.status(200).json({
      userID: user._id,
      email: user.email,
      token: generateJwtToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "User Registration failed" });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      userID: user._id,
      email: user.email,
      token: generateJwtToken(user._id),
    });
  } else {
    return res
      .status(400)
      .json({ message: "Please provide valid credentials" });
  }
};

const generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

module.exports = { registerUser, loginUser };
