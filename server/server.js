require("dotenv").config();
const { connect } = require("mongoose");
const app = require("./app");
const { Server } = require("socket.io");
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

const io = new Server(server, {
  cors: ["http://192.168.43.14:8081", "http://127.0.0.1:8081"],
});
con.then(() => {
  io.on("connection", (socket) => {
    console.log("user connected to socket with id: ", socket.id);
    const userId = socket.handshake.query.userId;
    if (!userId) return;
    socket.join(userId);
    console.log("joined own room to receive messages");

    // listen for new messages
    socket.on("new-message", (msg) => {
      socket.to(msg.receiver._id).emit("incoming", msg, () => {
        console.log("user acknowledged message reception");
      });
    });
  });
});
