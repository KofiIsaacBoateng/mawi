require("dotenv").config();
const data = require("./user-data");
const User = require("../models/User");
const mongoose = require("mongoose");

const uploadData = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async (res) => {
      const updatedData = data.map((item) => ({
        ...item,
        password: "password",
        location: [item.location.longitude, item.location.latitude],
      }));
      await User.insertMany(updatedData);
      console.log("upload successful!");
    })
    .catch((error) => console.log("Error uploading data: ", error))
    .finally((data) => console.log("Procedure completed!"));
};

uploadData();
