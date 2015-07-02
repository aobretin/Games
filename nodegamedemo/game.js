// this are the required node modules
var util = require('util'),
	io = require('socket.io'),
	// You'll need to require the server Player class within the game.js file, so add the following after requiring Socket.IO
	Player = require('./Player').Player;

// core game variables
var socket, players;

// we init the socket io
socket = io.listen(8000);

// The second step is optional and limits Socket.IO to using WebSockets and not falling back to anything else. This step also cuts down the amount of output that Socket.IO spits into the terminal.
// Add the following at the end of the init function (optional)
socket.configure(function() {
	socket.set('transports', ['websocket']);
	socket.set('log level', 2);
});

// Underneath that create the initialisation function and set the players variable to an empty array
function init() {
	players = [];

	setEventHandlers();
};

// The inside line listens for new connections to Socket.IO, passing them off to the onSocketConnection function which doesn't exist yet
function setEventHandlers() {
	socket.sockets.on('connection', onSocketConnection);
};

// functipn that controls the client in certain statuses
// The client.on event listeners are used to detect when a player has either disconnected or sent a message to the server
function onSocketConnection(client) {
	util.log('New player has connected: ' + client.id);
	client.on('disconnect', onClientDisconnect);
	client.on('new player', onNewPlayer);
	client.on('move player', onMovePlayer);
};

// In the onClientDisconnect handler function, the this object refers to the client variable from the onSocketConnection function. 
// Slightly confusing but bear with it
function onClientDisconnect() {
	var removePlayer = playerById(this.id);

	util.log('Player has disconnect: ' + this.id);

	if (!removePlayer) {
		util.log('Player not found: ' + this.id);
		return false;
	};

	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit('remove player', {
		id: this.id
	});
};

// This creates a new player instance using position data sent by the connected client. 
// The identification number is stored for future reference
function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	// It's important to point out that this.broadcast.emit sends a messages to all clients bar the one we're dealing with, 
	// while this.emit send a message only to the client we're dealing with.

	// Now the new player is created you can send it to the other connected players by adding the following below the previous code:
	this.broadcast.emit("new player", {
		id: newPlayer.id, 
		x: newPlayer.getX(), 
		y: newPlayer.getY()
	});

	// Now you need to send the existing players to the new player by adding the following below the previous code:
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit('new player', {
			id: existingPlayer.id,
			x: existingPlayer.getX(),
			y: existingPlayer.getY()
		});
	};

	// The last step is to add the new player to the players array so we can access it later.
	players.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(this.id);

	if (!movePlayer) {
	    util.log("Player not found: " + this.id);
	    return;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	this.broadcast.emit("move player", {
		id: movePlayer.id, 
		x: movePlayer.getX(), 
		y: movePlayer.getY()
	});
};

// To remove players you need a quick way to find them in the players array, so add the following helper function to the end of the file:
function playerById(id) {
	var i;

	for (i = 0; i < players.length; i++) {
		if (players[i].id == id) {
			return players[i];
		}
	}

	return false;
}

// we init the multiplayer
init();


