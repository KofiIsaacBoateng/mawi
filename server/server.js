require("dotenv").config();
const { connect } = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI;

/**** connect to mongodb */
const con = connect(MONGO_URI)
  .then((res) => console.log("Connection to DB successful"))
  .catch((err) =>
    console.log("Error while connecting to database", err.message)
  );

const server = require("http").createServer(app);

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
