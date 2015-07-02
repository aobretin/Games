var cube, title, rockHit, die, runSound, soundEnabled;

soundEnabled = true;

rockHit = document.getElementById('rockHit');
die = document.getElementById('die');
runSound = document.getElementById('runSound');

backgroundMusic = document.getElementById('backgroundMusic');

backgroundMusic.addEventListener('ended', function() {
	backgroundMusic.currentTime = 0;
	backgroundMusic.play();
});
backgroundMusic.play();

function toggleSounds() {
	var soundButton = document.querySelector('#sound_toggle');

	if (document.body.classList.contains('paused-sound')) {
		backgroundMusic.play();
		document.body.classList.remove('paused-sound');
		soundEnabled = true;
	} else {
		backgroundMusic.pause();
		document.body.classList.add('paused-sound');
		soundEnabled = false;	
	}

	soundButton.innerHTML == 'Turn sound off' ? soundButton.innerHTML = 'Turn sound on' : soundButton.innerHTML = 'Turn sound off';
}

onkeydown = function(event) {
	if (event.which == 13) {
		var buttons = document.querySelectorAll('.function-btn');
		var triggerStart = document.createEvent("HTMLEvents");
		triggerStart.initEvent('click', true, false);
		if (document.querySelector('#restart').style.display == 'block') {
			buttons[0].dispatchEvent(triggerStart);
		} else {
			buttons[1].dispatchEvent(triggerStart);
		}
	}
}

title = document.querySelector('h1');

setInterval(function() {
	if (title.style.color == 'red') {
		title.style.color = 'blue';
	} else {
		title.style.color = 'red';
	}
}, 500);

cube = {
	firstCube: null,
	interval: null,

	init: function() {
		var overlays = document.querySelectorAll('.overlay');

		for (var i = 0; i < overlays.length; i++) {
			overlays[i].style.display = 'none';
		};

		this.makeBoy();
		this.makeCircle();
		this.moveObjects(cube.firstCube);
	},

	destroy: function() {
		document.getElementById('container').innerHTML = '';
		this.init();
	},

	makeBoy: function() {
		this.boy = document.createElement('div');
		this.boy.setAttribute('id', 'boy');
		this.boy.style.width = '80px';
		this.boy.style.height = '158px';
		this.boy.style.background = 'url(images/idle.gif) no-repeat center';
		this.boy.style.backgroundSize = '100%';
		this.boy.style.position = 'absolute';
		this.boy.style.left = '0px';
		this.boy.style.top = '200px';
		document.getElementById('container').appendChild(this.boy);
	},

	makeCircle: function() {
		this.circle = document.createElement('div');
		this.circle.setAttribute('id', 'circle');
		this.circle.style.width = '300px';
		this.circle.style.height = '300px';
		this.circle.style.background = 'url(images/rock.png) no-repeat center';
		this.circle.style.backgroundSize = '100%';
		this.circle.style.position = 'absolute';
		this.circle.style.left = Math.round(Math.random() * 800) + 'px';
		this.circle.style.top = Math.round(Math.random() * 500) + 'px';
		document.getElementById('container').appendChild(this.circle);
		this.firstCube = document.querySelector('#circle');

	},

	/** @TODO multiple rocks adding **/

	// addRock: function() {
	// 	var rockId = 1;
	// 	this.addedRock = document.createElement('div');
	// 	this.addedRock.setAttribute('id', 'circle_' + rockId);
	// 	this.addedRock.style.width = '300px';
	// 	this.addedRock.style.height = '300px';
	// 	this.addedRock.style.background = 'url(rock.png) no-repeat center';
	// 	this.addedRock.style.backgroundSize = '100%';
	// 	this.addedRock.style.position = 'absolute';
	// 	this.addedRock.style.left = Math.round(Math.random() * 800) + 'px';
	// 	this.addedRock.style.top = Math.round(Math.random() * 500) + 'px';
	// 	document.getElementById('container').appendChild(this.addedRock);
	// 	this.rocks = document.getElementById('circle_' + rockId);
	// 	rockId++;
	// 	this.moveObjects(cube.rocks);
	// },

	moveObjects: function(rock) {
		var idleImg = document.getElementById('idle').getAttribute('src');
		var idleReverseImg = document.getElementById('idle-reverse').getAttribute('src');
		var runImg = document.getElementById('run').getAttribute('src');
		var runReversImg = document.getElementById('run-reverse').getAttribute('src');

		var initScore = 0;
		var startGame = false;
		var hit = false;
		var lifeTable = document.getElementById('life');
		var initLife = 3;

		var tankSpeedX = 0,
			tankSpeedY = 0,
			rotate = 0,
			moveX = '',
			moveY = '',
			tankAccX = 2,
			tankAccY = 2,
			vx = 8,
			vy = 8;

		onkeydown = function(event) {
			switch(event.which) {
				case 39: //right arrow
					moveX = 'right';
					this.boy.style.background = 'url(' + runImg + ') no-repeat center';
					this.boy.style.backgroundSize = '100%';
					if (soundEnabled) runSound.play();
					startGame = true;
					break;
				case 37: // left arrow
					moveX = 'left';
					this.boy.style.background = 'url(' + runReversImg + ') no-repeat center';
					this.boy.style.backgroundSize = '100%';
					if (soundEnabled) runSound.play();
					startGame = true;
					break;
				case 38: // up arrow
					moveY = 'up';
					if (this.boy.style.background.split('/')[10].split(')')[0] == idleReverseImg.split('/')[1] ||
						this.boy.style.background.split('/')[10].split(')')[0] == runReversImg.split('/')[1]) {
						this.boy.style.background = 'url(' + runReversImg + ') no-repeat center';
					} else {
						this.boy.style.background = 'url(' + runImg + ') no-repeat center';
					}
					this.boy.style.backgroundSize = '100%';
					if (soundEnabled) runSound.play();
					startGame = true;
					break;
				case 40: // down arrow
					moveY = 'down';
					if (this.boy.style.background.split('/')[10].split(')')[0] == idleReverseImg.split('/')[1] ||
						this.boy.style.background.split('/')[10].split(')')[0] == runReversImg.split('/')[1]) {
						this.boy.style.background = 'url(' + runReversImg + ') no-repeat center';
					} else {
						this.boy.style.background = 'url(' + runImg + ') no-repeat center';
					}
					this.boy.style.backgroundSize = '100%';
					if (soundEnabled) runSound.play();
					startGame = true;
					break;
			}

		};

		onkeyup = function(event) {
			switch(event.which) {
				case 39:
					moveX = '';
					cube.boy.style.background = 'url(' + idleImg + ') no-repeat center';
					this.boy.style.backgroundSize = '100%';
					break;
				case 37:
					moveX = '';
					cube.boy.style.background = 'url(' + idleReverseImg + ') no-repeat center';
					this.boy.style.backgroundSize = '100%';
					break;
				case 38:
				case 40: 
					moveY = '';
					if (this.boy.style.background.split('/')[10].split(')')[0] == runReversImg.split('/')[1]) {
						cube.boy.style.background = 'url(' + idleReverseImg + ') no-repeat center';
					} else {
						cube.boy.style.background = 'url(' + idleImg + ') no-repeat center';
					}
					this.boy.style.backgroundSize = '100%';
					break
			}
		};

		interval = setInterval(function(event){
			// object move

			var leftCircle = parseInt(rock.style.left, 10);
			var topCircle = parseInt(rock.style.top, 10);

			rock.style.transform = 'rotate(' + rotate + 'deg)';
			rotate++;

			if (leftCircle < 0 || (leftCircle + rock.offsetWidth) > window.innerWidth) {
					vx *= -1;
				}

			if (topCircle < 0 || (topCircle + rock.offsetHeight) > window.innerHeight) {
					vy *= -1;
				}

			var difficulty = setInterval(function() {
				if (vx < 25 && vy < 25) {
					vx *= 1.001;
					vy *= 1.001;

				} else {
					clearInterval(difficulty);
				}
				
			}, 10000);

			rock.style.left = (leftCircle + vx) + 'px';
			rock.style.top = (topCircle + vy) + 'px';

			// boy move

			if (moveX == 'left' && tankSpeedX > -20) {
				tankSpeedX -= tankAccX;
			} else if (moveX == 'right' && tankSpeedX < 20) {
				tankSpeedX += tankAccX;
			} else {
				tankSpeedX *= 0.9;
			}

			if (moveY == 'up' && tankSpeedY > -20) {
				tankSpeedY -= tankAccY;
			} else if (moveY == 'down' && tankSpeedY < 20) {
				tankSpeedY += tankAccY;
			} else {
				tankSpeedY *= 0.9;
			}

			var leftTank = parseInt(cube.boy.style.left, 10);
			var topTank = parseInt(cube.boy.style.top, 10);

			if ((leftTank + tankSpeedX + parseInt(cube.boy.style.width)) < window.innerWidth && leftTank + tankSpeedX >= 0) {
				cube.boy.style.left = (leftTank + tankSpeedX) + 'px';
			}

			if ((topTank + tankSpeedY + parseInt(cube.boy.style.height)) < window.innerHeight && topTank + tankSpeedY >= 0) {
				cube.boy.style.top = (topTank + tankSpeedY) + 'px';
			}

			var circleCenterX = (parseInt(rock.style.left) + (parseInt(rock.style.width) / 2)),
				circleCenterY = (parseInt(rock.style.top) + (parseInt(rock.style.height) / 2)),
				boyCenterX = (parseInt(cube.boy.style.left) + (parseInt(cube.boy.style.width) / 2)),
				boyCenterY = (parseInt(cube.boy.style.top) + (parseInt(cube.boy.style.height) / 2)),
				circleDistanceX = Math.abs(circleCenterX - boyCenterX),
				circleDistanceY = Math.abs(circleCenterY - boyCenterY),
				circleRadius = parseInt(rock.style.width) / 2,
				boyHeight = parseInt(cube.boy.style.height),
				boyWidth = parseInt(cube.boy.style.width),
				scoreTable = document.getElementById('score'),
				restartOverlay = document.getElementById('restart'),
				finalScore = document.getElementById('final-score'),
				hitOverlay = document.getElementById('hit-overlay');

				if (startGame) {
					scoreTable.innerHTML = 'Score: ' + initScore;
					initScore++;
				}

				lifeTable.innerHTML = initLife;

			if (circleDistanceX > (boyWidth/2 + circleRadius) || circleDistanceY > (boyHeight/2 + circleRadius)) {
				hit = false;
				return;
			} else if (circleDistanceX <= boyWidth/2 || circleDistanceY <= boyHeight/2) {
				if (hit == false) {
					hit = true;
					if (soundEnabled) rockHit.play();
					initLife--;
					vx *= -1;
					vy *= -1;
					lifeTable.innerHTML = initLife;
					hitOverlay.style.display = 'block';

					/** @TODO multiple rocks adding **/

					// if (!document.contains(cube.rocks)) {
					// 	setTimeout(function(){
					// 		cube.addRock();
					// 	},100);
					// } 
					
					setTimeout(function() {
						hitOverlay.style.display = 'none';
					},500);
				}

				if (initLife == 1) {
					lifeTable.classList.add('blink');
				}

				if (initLife == 0) {
					if (soundEnabled) die.play();
					cube.boy.style.width = '158px';
					cube.boy.style.height = '85px';
					cube.boy.style.background = 'url(images/dead.png) no-repeat center';
					lifeTable.classList.remove('blink');
					clearInterval(interval);
					onkeydown = function(event) {
						switch(event.which) {
							case 39:
							case 37:
							case 38:
							case 40:
								return false; 
								break
						}

					};

					onkeyup = function(event) {
						switch(event.which) {
							case 39:
							case 37:
							case 38:
							case 40: 
								return false;
								break
						}
					};
					finalScore.innerHTML = 'Your score was: ' + initScore;
					restartOverlay.style.display = 'block';
				}
			}

			var cornerDistance_sq = (circleDistanceX - boyWidth/2)^2 + (circleDistanceY - boyHeight/2)^2;

			return (cornerDistance_sq <= (circleRadius^2));

		}, 33);
		
	}
	
};