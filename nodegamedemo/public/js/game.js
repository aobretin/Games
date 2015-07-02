/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Other players
	socket;			// Socket variable for multiplayer


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);

		// The next step is to initialise the socket connection to the server.
	socket = io.connect('http://localhost', {
		port: 8000,
		transports: ['websocket']
	});

	remotePlayers = [];

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	// The final step is to listen for socket events and set up the handler functions to deal with them.
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
	console.log('Connected to socket server');

	// Nothing will happen yet as you haven't told the server that you want it to create a new player when you connect.
	// To do that you need to add the following code to the onSocketConnected handler function:
	socket.emit('new player', {
		x: localPlayer.getX(),
		y: localPlayer.getY()
	});
};

function onSocketDisconnect() {
	console.log('Disconnected from socket server');
};

function onNewPlayer(data) {
	console.log('New player connected: ' + data.id);

	// This will create a new player object based on the position data sent from the server. 
	// It then sets the identification number of the player and adds it to the remotePlayers array so we can access it later.
	console.log(data);
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	// This will search for the player that is being moved and will update its x and y position 
	// using the setter methods you defined in the Player.js file.
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
		console.log('Player not found: ' + data.id);
		return false;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	if (!removePlayer) {
	    console.log("Player not found: " + data.id);
	    return false;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if (localPlayer.update(keys)) {
		socket.emit('move player', {
			x: localPlayer.getX(),
			y: localPlayer.getY()
		})
	}
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	var i;
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	// This will loop through every remote player and draw it to the canvas.
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	}
};