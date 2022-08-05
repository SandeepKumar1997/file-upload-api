const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(userId.id).select("-password");
    next();
  } else {
    return res
      .status(400)
      .json({ message: "Not authorized to access this path!" });
  }

  if (!token) {
    return res.status(400).json({ message: "Token not found" });
  }
};

module.exports = authUser;
