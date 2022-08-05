const { awsFileUpload } = require("../aws/awsServer");
const Image = require("../models/imageSchema");
const User = require("../models/userSchema");
const nodeMailer = require("nodemailer");
const cron = require("node-cron");

const getUserImages = async (req, res, next) => {
  const userID = req.user._id;
  const images = await Image.find({ user: userID });
  return res.status(200).json(images);
};

const uploadService = async (req, res, next) => {
  let transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const userID = req.user;
  const { schedule } = req.body;
  console.log(userID);
  const emailid = await User.findById(userID);
  try {
    const response = await awsFileUpload(req.files);
    const urlCol = response.map((item) => {
      return {
        url: item.Location,
      };
    });

    const data = urlCol.map((item) => {
      return `<h1>Welcome</h1><p>That was easy! <a href=${item.url}>${item.url}</a></p>`;
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: emailid.email,
      subject: "Sending Email using Node.js",
      html: data,
    };

    if (schedule === "Yes") {
      let task = cron.schedule("* * * * *", () => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
      task.start();
      setTimeout(() => {
        task.stop();
      }, 1000);
    } else {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    const imageData = await Image.create({
      user: userID._id,
      email: emailid.email,
      schedule,
      awsurl: urlCol,
    });
    res.status(200).json(imageData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { uploadService, getUserImages };
