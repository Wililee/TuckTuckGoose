var express = require("express");
const e = require("express");
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

    //default sets the room creater turn to true
    socket.turn = true;
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
      socket.turn = false;
      socket.roomID = room.id;
      room.sockets.forEach((s) => {
        socket.emit("playerJoined", s.name);
      });
      socket.broadcast.in(room).emit("playerJoined", socket.name);
      //assign each player their colour
      socket.colour = assignCol(room.id);
      io.in(room).emit("disableColBtns", room.chosenColours);
      console.log(socket.name, "Joined", room.id);
      //check if there are 6 people in
      //if (room.sockets.length === 6)
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
    io.in(room).emit("displayGame");
    socket.emit("getNewDeck");
    socket.turn = true;
    dealOutCards(room, 5);

    //io.in(room).emit("displayCards");
  });

  //initalize player hands
  socket.on("initHand", (hand) => {
    socket.hand = [];
    socket.drawFlag = false;
  });

  //get a deck from a socket and sets all other sockets deck to it
  socket.on("getDeck", (deck) => {
    //set everyones deck to the same one
    io.in(socket.room).emit("setDeck", deck);
  });

  //deals out a number of cards to each player
  function dealOutCards(room, cardsPerHand) {
    socket.emit('takeCards', cardsPerHand*room.sockets.length, cardsPerHand)
  }

  //gives out a set num of cards to each player
  socket.on("giveOutCards", (cards, cardsPerHand) => {
    socket.room.sockets.forEach((s) => {
      for (var i = 0; i < cardsPerHand; i++) s.hand.push(cards.pop());
    });
    io.in(room).emit('updateHand') //just calls another emit to grab their hand
  });

  socket.on('setHand',() => {
    socket.emit('setMyHand', socket.hand);//this is just sending an array of cards
  })

  socket.on('dispCards',()=>{
    socket.emit('displayCards')
  })

  function moveTurnToNextSocket() {
    console.log("changed to next turn");
    var i = 0;
    socket.room.sockets.forEach((s) => {
      if (s.turn === true) {
        s.turn = false;
        if (i === socket.room.sockets.length - 1) {
          socket.room.sockets[0].turn = true;
          return;
        } else {
          socket.room.sockets[i + 1].turn = true;
          return;
        }
      }
      i++;
    });
  }

  function findSocketWithCol(room, c) {
    for (s in room.sockets) if (s.colour === c) return s;
  }
});

/*
turn for each socket (need this anyways) socket.on'yourturnToTakeCard'
take from top of deck
update everyones deck

pass to next turn --> get the list of sockets in the room and give to the one that is next
if its the last one go to the first.

the first person to be blocked would be their turn first. for the actual game

why not get each to just draw 6 then pass the turn on



so async functions return a promise

then if we use await to wait for that promis then we can do that action

here it is applied 

async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)

  alert(result); // "done!"
}

ONLY WORKS IN ASYNC FUNCTIONS MAKE SURE TO USE INSIDE ASYNC

so...

async dealoutCards{

  everyone takes cards
  await the card take action
  then do the next one !

}

set to promiss

wait till promis gets thru till i do the change turn thing



///////
new idea
draw a bunch of cards
seperate into piles and assign then to the socket.hand
then just emit to set hand 
duh?



*/
