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
  socket.on('invalidRoom', () =>{
    $("#menu").show();
    $("#lobby").hide();
    $('#errmsg').text("Invalid Room ID")
  })

//Displaying player names
socket.on("playerJoined", (data) => {
  $("#playerNames").append($("<li>").text(data));
});

//Setting up player colour
$("#whiteBtn").on("click", () => {
  socket.emit('selectCol', "W");
});


/* --- GAME SETUP ---*/
//Initial player properties
var turn = false;
var hand;
var name;
var pieces;
var partner;
var colour;
var selectedPiece = {
  pieceID: 0,
  colour: null,
  x: -1,
};
var selectedCard = {
  cardID: 0,
  suite: null,
  value: null,
  actions: null,
};
//the action is default set to just move after everytime
//m - move  r - release s - swap
var selectedAction = "m";

//give event listeners for cards
function giveCardEventListeners() {
  for (let i = 0; i < hand.length; i++)
    hand[i].addEventListener("click", selectCard(hand[i]));
}

function selectCard(card) {
  selectedCard.suite = card.suite;
  selectedCard.value = card.value;
  selectedCard.cardID = cardID;
  if (((card.value = 1), 11, 13, 20)) giveActionEventListener(card);
  else {
    selectedAction = "m";
    givePieceEventListeners();
  }
}

//removing action listeners for cards
function removeCardEventListener() {
  for (let i = 0; i < hand.length; i++)
    hand[i].removeEventListener("click", selectCard(hand[i]));
}

//give Event listener for action
function giveActionEventListener(card) {
  for (let i = 0; i < card.actions.length; i++)
    card.actions[i].addEventListener("click", selectAction(card.actions[i]));
}

function selectAction(action) {
  selectedAction = action;
  givePieceEventListeners();
}

//giving action listeners for pieces
function givePieceEventListeners() {
  for (let i = 0; i < pieces.length; i++)
    pieces[i].addEventListener("click", selectPiece(pieces[i]));
}

function selectPiece(piece) {
  selectedPiece.pieceID = piece.pieceID;
  selectedPiece.colour = piece.colour;
  selectedPiece.x = piece.x;
  makeMove();
}

//remove action listener for pieces
function removePieceEventListeners() {
  for (let i = 0; i < pieces.length; i++)
    pieces[i].removeEventListener("click", selectPiece(pieces[i]));
}

function isPieceAtPosition(c, x) {}
function validMove() {}
function validRelease() {}
function checkForWin() {}
function isValidMove() {}

function selectPiece() {}

function StartTurn() {
  turn = true;
}

//getting piece out
function releasePiece(pieceID) {}

//Highlight selected piece
function highlightPiece(pieceID) {
  document.getElementById(pieceID).style.border = "2px solid purple";
}

function makeMove() {
  //if isValidMove

  //depends on action

  //regular move
  if (selectedAction === "m") {
    if (validMove(selectedPiece, selectedCard)) {
    }
  }

  //swap
  if (selectedAction === "s") {
  }
  //release a piece
  if (selectedAction === "r") {
  }

  turn = false;
}
