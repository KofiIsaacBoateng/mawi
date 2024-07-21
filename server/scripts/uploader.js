require("dotenv").config();
const data = require("./user-data");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const uploadData = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async (res) => {
      const updatedData = await Promise.all(
        data.map(async (item) => ({
          ...item,
          password: await bcrypt.hash("password", 10),
          location: [item.location.longitude, item.location.latitude],
        }))
      );
      await User.insertMany(updatedData);
      console.log("upload successful!");
    })
    .catch((error) => console.log("Error uploading data: ", error))
    .finally((data) => console.log("Procedure completed!"));
};

uploadData();
