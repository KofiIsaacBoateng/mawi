const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("./CustomErrorAPI");

class Forbidden extends CustomErrorAPI {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Forbidden;
