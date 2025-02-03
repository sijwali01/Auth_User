const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manishsijwali:manish%4012345@cluster0.mnryh.mongodb.net/"
    );
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbconnect;
