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
      active: false,
    };
    //puts the room in the list of rooms :P
    rooms[room.id] = room;
    //makes them join the room they just created
    joinRoom(socket, room);
  });
  
  //When clicking joinRoom button, joins that room
  socket.on("joinlobby", (roomID) => {
    if (!rooms[roomID] || rooms[roomID].active){
      socket.emit('invalidRoom');
      return;
    }
    joinRoom(socket, rooms[roomID]);
  });

  //Takes in a socket and a room and inserts the player into the room
  const joinRoom = (socket, room) => {
    room.sockets.push(socket); //adds player to list of sockets
    socket.join(room, () => {
      socket.roomID = room.id;
      room.sockets.forEach(s => {
        socket.emit('playerJoined', s.name)
      });
      console.log(socket.name, "Joined", room.id);
    });
  };
  


  //Gives the player a colour
  socket.on('selectCol', (colour) =>{
    socket.colour = colour;
    console.log(socket.name, "colour:", socket.colour);
  })

});

