const express = require("express");
const { getServicesWithin } = require("../controllers/services");
const protector = require("../middleware/protector");
const router = express.Router();

router.use(protector);

router.route("/service/:serviceType/within/:lnglat").get(getServicesWithin);

module.exports = router;
