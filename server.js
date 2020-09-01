var app = require("express")();
const PORT = process.env.PORT || 3000;
var socket = require("socket.io");

var server = app.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

var io = socket(server);


const rooms = {};


io.sockets.on("connection", (socket) => {
  console.log("ayy");
  
  //setting the name of the player to the inputted text field
  socket.on("setName", (data) => {
    socket.name = data;
  });
});
  /*
  //Creating a new room when create button is clicked
  socket.on("createLobby", (roomID) => {
    const room = {
      id: "ABCD",
      sockets: [],
    };
    console.log(room.id);
    //puts the room in the list of rooms :P
    rooms[room.id] = room;
    //makes them join the room they just created
    joinRoom(socket, room);
  });



//When clicking joinRoom button, joins that room
socket.on("joinLobby", (roomID, socket) => {
  joinRoom(socket, rooms[roomID]);
});

//Takes in a socket and a room and inserts the player into the room
const joinRoom = (socket, room) => {
  rooms.sockets.push(socket); //adds player to list of sockets
  socket.join(room.id, () => {
    socket.roomID = room.id;
    console.log(socket.id, "Joined", room.id);
  });
};

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
