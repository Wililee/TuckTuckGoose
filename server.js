// var app = require("express")();
// const PORT = process.env.PORT || 3000;
// var socket = require("socket.io");

var express = require("express");
var app = express();
const port = process.env.PORT || 3001;
var server = app.listen(port, () => {
  console.log("Listening on:" + port);
});
var io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/");
});

const rooms = {};

io.on("connect", (socket) => {
  //setting the name of the player to the inputted text field
  socket.on("setName", (data) => {
    socket.name = data;
  });

  //Creating a new room when create button is clicked
  socket.on("createlobby", (roomID) => {
    const room = {
      id: roomID,
      sockets: [],
    };
    //puts the room in the list of rooms :P
    rooms[room.id] = room;
    //makes them join the room they just created
    joinRoom(socket, room);
  });

  //When clicking joinRoom button, joins that room
  socket.on("joinlobby", (roomID) => {
    joinRoom(socket, rooms[roomID]);
  });

  //Takes in a socket and a room and inserts the player into the room
  const joinRoom = (socket, room) => {
    room.sockets.push(socket); //adds player to list of sockets
    console.log(room.sockets.length)
    socket.join(room, () => {
      socket.roomID = room.id;
      room.sockets.forEach(s => {
        s.emit('playerJoined', s.name)
      });
      console.log(socket.name, "Joined", room.id);
    });
  };
});
/*

const leaveRooms = (socket) => {
  const roomsToDelete = [];
  for (const id in rooms) {
    const room = rooms[id];
    //checks if the socket is in that room
    if (room.socket.includes(socket)) {
      socket.leave(id);
      room.socket = room.socket.filter((item) => item !== socket);
    }
    //if there is nobody in the room now
    if (room.socket.length == 0) roomsToDelete.push(room);
  }
  for (const room in roomsToDelete) delete rooms[room.id];
};

*/
