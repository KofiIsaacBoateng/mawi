const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

module.exports.getServicesWithin = async (req, res) => {
  const { lnglat, serviceType } = req.params;
  const [longitude, latitude] = lnglat.split(",");
  const radius = 30 / 6378.1;
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
  }).limit(15);

  res.status(StatusCodes.OK).json({
    success: true,
    data: people,
    msg: "Found some workers around you",
  });
};

module.exports.aggServicesWithin = async (req, res) => {};
