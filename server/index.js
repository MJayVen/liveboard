const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// when user connects via websockets
io.on("connection", (socket) => {
  console.log("a user connected");

  // when server receives canvas data, broadcast it to all connected users
  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
});

const serverPort = process.env.MY_PORT || process.env.PORT || 3000;
http.listen(serverPort, () => {
  console.log(`Listening on port ${serverPort}`);
});
