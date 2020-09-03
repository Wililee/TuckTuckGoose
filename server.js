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
      chosenColours: {
        W: false,
        B: false,
        R: false,
        Bl: false,
        Y: false,
        G: false,
      },
    };
    //puts the room in the list of rooms :P
    rooms[room.id] = room;
    //makes them join the room they just created
    joinRoom(socket, room);
  });

  //When clicking joinRoom button, joins that room
  socket.on("joinlobby", (roomID) => {
    if (
      !rooms[roomID] ||
      rooms[roomID].active ||
      rooms[roomID].sockets.length >= 6
    ) {
      socket.emit("invalidRoom");
      return;
    }
    joinRoom(socket, rooms[roomID]);
  });

  //Takes in a socket and a room and inserts the player into the room
  const joinRoom = (socket, room) => {
    room.sockets.push(socket); //adds player to list of sockets
    socket.join(room, () => {
      socket.room = room;
      socket.roomID = room.id;
      room.sockets.forEach((s) => {
        socket.emit("playerJoined", s.name);
      });
      socket.broadcast.in(room).emit("playerJoined", socket.name);
      //assign each player their colour
      socket.colour = assignCol(room.id);
      socket.emit("disableColBtns", room.chosenColours);
      socket.broadcast.in(room).emit("disableColBtns", room.chosenColours);
      console.log(socket.name, "Joined", room.id);
      //check if there are 6 people in
      if (room.sockets.length === 6)
        socket.broadcast.in(room).emit("enableGameStart");
    });
  };

  //assigns a player a colour based on avalible colours
  function assignCol(roomID) {
    if (rooms[roomID].chosenColours.W == false) {
      rooms[roomID].chosenColours.W = true;
      return "W";
    }
    if (rooms[roomID].chosenColours.B == false) {
      rooms[roomID].chosenColours.B = true;
      return "B";
    }
    if (rooms[roomID].chosenColours.R == false) {
      rooms[roomID].chosenColours.R = true;
      return "R";
    }
    if (rooms[roomID].chosenColours.Bl == false) {
      rooms[roomID].chosenColours.Bl = true;
      return "Bl";
    }
    if (rooms[roomID].chosenColours.Y == false) {
      rooms[roomID].chosenColours.Y = true;
      return "Y";
    }
    if (rooms[roomID].chosenColours.G == false) {
      rooms[roomID].chosenColours.G = true;
      return "G";
    }
  }

  //Gives the player a colour
  socket.on("selectCol", (colour) => {
    var c = rooms[socket.roomID].chosenColours;

    //unselects the colour
    if (socket.colour == "W") c.W = false;
    else if (socket.colour == "B") c.B = false;
    else if (socket.colour == "R") c.R = false;
    else if (socket.colour == "Bl") c.Bl = false;
    else if (socket.colour == "Y") c.Y = false;
    else if (socket.colour == "G") c.G = false;

    socket.colour = colour;
    if (socket.colour == "W") c.W = true;
    else if (socket.colour == "B") c.B = true;
    else if (socket.colour == "R") c.R = true;
    else if (socket.colour == "Bl") c.Bl = true;
    else if (socket.colour == "Y") c.Y = true;
    else if (socket.colour == "G") c.G = true;

    socket.emit("disableColBtns", rooms[socket.roomID].chosenColours);
    socket.broadcast
      .in(socket.room)
      .emit("disableColBtns", rooms[socket.roomID].chosenColours);
  });

  socket.on("startGame", () => {
    room = socket.room;
    //Assign partners (bl-w,r-g,b-y)
    for (s in room.sockets) {
      if (s.colour === "W") {
        s.partner = findSocketWithCol("Bl");
        findSocketWithCol("Bl").partner = s;
      } else if (s.colour === "R") {
        s.partner = findSocketWithCol("G");
        findSocketWithCol("G").partner = s;
      } else if (s.colour === "B") {
        s.partner = findSocketWithCol("Y");
        findSocketWithCol("Y").partner = s;
      }
    }
    //change to the start screen
    socket.emit("displayGame");
    socket.broadcast.in(room).emit("displayGame");

    //give out initial hand w/deck (create deck obj)

    //display individual hand
  });

  function findSocketWithCol(room, c) {
    for (s in room.sockets) if (s.colour === c) return s;
  }
});
