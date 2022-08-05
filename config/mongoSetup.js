const mongoose = require("mongoose");

const mongoSetup = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Database connection is established at ${mongo.connection.host}`
    );
  } catch (error) {
    console.log("Error" + error.message);
  }
};

module.exports = mongoSetup;
