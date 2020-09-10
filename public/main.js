class Card {
  constructor(suite, value) {
    this.suite = suite;
    this.value = value;
  }
  getString() {
    return toString(this.suite) + toString(this.value);
  }
}
class Deck {
  constructor() {
    this.cards = [];
    for (var i = 1; i <= 13; i++) {
      this.cards.push(new Card("club", i));
      this.cards.push(new Card("heart", i));
      this.cards.push(new Card("diamond", i));
      this.cards.push(new Card("spade", i));
    }
    this.cards.push(new Card("joker", 20));
    this.cards.push(new Card("joker", 20));
    
    //shuffles the cards
    var curIndex = this.cards.length, tempVal, randIndex;
    while(0 !== curIndex){
      randIndex = Math.floor(Math.random() * curIndex);
      curIndex -= 1;
      tempVal = this.cards[curIndex];
      this.cards[curIndex] = this.cards[randIndex];
      this.cards[randIndex] = tempVal
    }
  }

  draw() {
    return this.cards.pop();
  }

  size() {
    return this.cards.size();
  }

  //add a reset function
}
class Hand {
  constructor(cards) {
    this.cards = cards;
  }

  remove(c) {
    return this.cards.pop(c);
  }

  hasCard(c) {
    for (i in this.cards) if (i == c) return true;
  }

  addCard(c) {
    this.cards.push(c);
  }
}

class Piece {
  constructor(colour, c, x){
    this.colour = colour;
    this.c = c;
    this.x = x;
  }
}

class Board {
 constructor(){
   //has piececs
 }
}

/*---LOBBY SETUP---*/
//disabiling some screens
$("#inGame").hide();
$("#lobby").hide();
$("#menu").hide();

//Setting up name
$("#enterName").focus();
$("#enterName").on("keyup", (key) => {
  if (key.keyCode == 13) {
    key.preventDefault();
    name = $("#enterName").val();
    socket.name = $("#enterName").val();
    socket.emit("setName", $("#enterName").val());
    $("#getName").hide();
    $("#menu").show();
  }
});

//Creating a Lobby
$("#createLobby").focus();
$("#createLobby").on("click", () => joinLobby(getNewCode(), "createlobby"));

//randomly generated room code
function getNewCode() {
  return Math.floor(Math.random() * 10000 + 1);
}

//click the join lobby
$("#joinLobby").on("click", () =>
  joinLobby($("#enterCode").val(), "joinlobby")
);

//Joining a created lobby
function joinLobby(roomID, action) {
  //move to the lobby screen
  $("#menu").hide();
  $("#lobby").show();
  $("#displayRoomID").html(roomID);
  //only allow lobby owner to start game
  if (action === "createlobby") {
    socket.emit("createlobby", roomID);
    $("#startGame").show();
  } else {
    $("#startGame").hide();
    socket.emit("joinlobby", roomID);
  }
}

//trying to join a room that doesnt exist
socket.on("invalidRoom", () => {
  $("#menu").show();
  $("#lobby").hide();
  $("#errmsg").text("Invalid Room ID");
});

//Displaying player names
socket.on("playerJoined", (data) => {
  $("#playerNames").append($("<li>").text(data));
});

//Setting up player colour
$("#whiteBtn").on("click", () => {
  socket.emit("selectCol", "W");
});
$("#blueBtn").on("click", () => {
  socket.emit("selectCol", "B");
});
$("#redBtn").on("click", () => {
  socket.emit("selectCol", "R");
});
$("#blackBtn").on("click", () => {
  socket.emit("selectCol", "Bl");
});
$("#yellowBtn").on("click", () => {
  socket.emit("selectCol", "Y");
});
$("#greenBtn").on("click", () => {
  socket.emit("selectCol", "G");
});

//disabiling selected colours
socket.on("disableColBtns", (colours) => {
  //enable all then disable the ones that are taken
  $("#whiteBtn").attr("disabled", false);
  $("#blueBtn").attr("disabled", false);
  $("#redBtn").attr("disabled", false);
  $("#blackBtn").attr("disabled", false);
  $("#yellowBtn").attr("disabled", false);
  $("#greenBtn").attr("disabled", false);
  if (colours.W === true) $("#whiteBtn").attr("disabled", true);
  if (colours.B === true) $("#blueBtn").attr("disabled", true);
  if (colours.R === true) $("#redBtn").attr("disabled", true);
  if (colours.Bl === true) $("#blackBtn").attr("disabled", true);
  if (colours.Y === true) $("#yellowBtn").attr("disabled", true);
  if (colours.G === true) $("#greenBtn").attr("disabled", true);
});

//Enable StartGame
socket.on("enableGameStart", () => {
  $("#startGame").attr("disabled", false);
});

$("#startGame").on("click", () => {
  socket.emit("startGame");
});

/* --- GAME SETUP ---*/
//Initial player properties
//let turn = false;
deck = new Deck();
hand = new Hand([]);
var name;
var turn = false;


//going to game veiw
socket.on("displayGame", () => {
  $("#lobby").hide();
  $("#inGame").show();
  socket.emit("initHand");
});

//deck setup
socket.on("getNewDeck", () => {
  socket.emit("getDeck", deck);
});

socket.on("setDeck", (newDeck) => {
  deck = newDeck;
});


socket.on('takeCards', (numCards, cardsPerHand) => {
  let cards = [];
  for (var i = 0; i < numCards; i ++)
    cards.push(deck.draw());
  
  socket.emit('getDeck', deck)
  socket.emit('giveOutCards', cards, cardsPerHand)
  
})

socket.on('updateHand', () =>{
  socket.emit('setHand');
})

socket.on('setMyHand', (newHand) => {
  while(newHand.length){
    hand.addCard(newHand.pop());
  }
  socket.emit('dispCards');
})

//displays the cards in the players hand
socket.on("displayCards", () => {
  $("#card1").text(hand.cards[0].suite + hand.cards[0].value);
  $("#card2").text(hand.cards[1].suite + hand.cards[1].value);
  $("#card3").text(hand.cards[2].suite + hand.cards[2].value);
  $("#card4").text(hand.cards[3].suite + hand.cards[3].value);
  $("#card5").text(hand.cards[4].suite + hand.cards[4].value);
});
