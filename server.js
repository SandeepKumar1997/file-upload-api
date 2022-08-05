const express = require("express");
const dotenv = require("dotenv");
const uploadRoute = require("./routes/uploadRoute");
const mongoSetup = require("./config/mongoSetup");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
dotenv.config({ path: "./config/config.env" });
const app = express();
app.use(express.json());
mongoSetup();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuidv4()}-${originalname}`);
//   },
// });

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype.split("/")[0] === "application") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000, files: 2 },
});

// const singleUpload = upload.single("fileUpload");

// const multiFilesUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "resume", maxCount: 1 },
// ]);
const multipleUploads = upload.array("fileUpload");

app.use("/api", multipleUploads, uploadRoute);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Please provide file within 1MB size" });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "File count has exceeded" });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "File is not of type Image" });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
