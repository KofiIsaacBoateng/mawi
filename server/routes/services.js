const express = require("express");
const { getServicesWithin } = require("../controllers/services");
const router = express.Router();

router.route("/service/:serviceType/within/:lnglat").get(getServicesWithin);

module.exports = router;
