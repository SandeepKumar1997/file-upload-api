const express = require("express");
const {
  getUserImages,
  uploadService,
} = require("../controllers/uploadController");
const { registerUser, loginUser } = require("../controllers/userController");
const authUser = require("../middleware/authMiddleware");
const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/upload", authUser, uploadService);
route.get("/history", authUser, getUserImages);

module.exports = route;
