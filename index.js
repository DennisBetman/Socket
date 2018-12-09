const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
.use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = socketIO(server);

// Register "connection" events to the WebSocket
io.on("connection", function(socket) {

  socket.emit('checkcode', io.sockets.adapter.rooms);
  socket.emit('setcode', io.sockets.adapter.rooms);

  socket.on('joinroom', function (code) {
    socket.join(code);
    socket.leave(socket.id);
  });

  socket.on('mobileroom', function (code) {
    var room = io.sockets.adapter.rooms[code];
    if(room.length < 2) {
      socket.join(code);
      socket.leave(socket.id);
      io.in(code).emit('mobileactive', 'true');
    } else {
      socket.emit('mobileroom', 'false');
    }
  });

  socket.on('move', function (move) {
    socket.to(Object.keys(socket.rooms).filter(item => item!=socket.id)).emit('move', move);
  });

  socket.on('disconnect', function(){
    // console.log(io.sockets.adapter.rooms);
    // console.log(socket.rooms);
    // console.log(socket.id);
  });

});
