// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static("public"));

const rooms = {}; // { roomName: [socket.id1, socket.id2] }

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    if (!rooms[room]) rooms[room] = [];

    if (rooms[room].length >= 2) {
      socket.emit("room-full");
      return;
    }

    rooms[room].push(socket.id);
    socket.join(room);
    socket.emit("joined", socket.id);

    if (rooms[room].length === 2) {
      io.to(room).emit("ready");
    }

    socket.on("signal", (data) => {
      socket.to(room).emit("signal", data);
    });

    socket.on("disconnect", () => {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
