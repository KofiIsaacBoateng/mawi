const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

module.exports.getServicesWithin = async (req, res) => {
  const { lnglat, serviceType } = req.params;
  const [longitude, latitude] = lnglat.split(",");
  // const radius = unit === "miles" ? distance / 3963.2 : distance / 6378.1;
  const radius = 0.00003347301604403137;
  let serviceTypeObject = {};

  if (serviceType && serviceType !== "none") {
    const regex = new RegExp(`^${serviceType}`, "i");
    serviceTypeObject = { title: regex };
  }
  const people = await User.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
    ...serviceTypeObject,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: people,
    msg: "Found some workers around you",
  });
};

module.exports.aggServicesWithin = async (req, res) => {};
