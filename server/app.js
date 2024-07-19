require("express-async-errors");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const routeNotFound = require("./middleware/routeNotFound");
const authRoute = require("./routes/auth");

const app = express();

/***** For form data */
app.use(express.urlencoded({ extended: false }));

/**** Body parser  */
app.use(express.json());

/**** CORS ***/
app.use(cors());

/**** routes */
app.use("/api/v1/auth", authRoute);

/***** error middleware */
app.use(errorHandler);
app.use(routeNotFound);

module.exports = app;
