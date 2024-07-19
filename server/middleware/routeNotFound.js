module.exports = (req, res) =>
  res.status(404).json({
    success: false,
    msg: `Route [${req.originalUrl}] cannot be found!`,
  });
