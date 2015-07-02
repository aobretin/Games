var spaceInvaders, toggleSound;

onkeydown = function(e) {
	var startButton = document.querySelector('#start'),
		triggerStart = document.createEvent("HTMLEvents");

		triggerStart.initEvent('click', true, false);

	if (e.which === 13) {
		startButton.dispatchEvent(triggerStart);
	}
}

toggleSound = function() {
	var soundBtn = document.querySelector('#soundToggle');

	soundBtn.addEventListener('click', function() {
		if (this.classList.contains('sound-off')) {
			this.setAttribute('class', 'sound-on');
			this.innerHTML = 'Sound: on';
			spaceInvaders.soundEnabled = true;
		} else {
			this.setAttribute('class', 'sound-off');
			this.innerHTML = 'Sound: off';
			spaceInvaders.soundEnabled = false;
		}
	});
}();

spaceInvaders = {
	shuttle: null,
	shuttleExhaust: null,
	enemy: null,
	playerLife: 3,
	playerScore: 0,
	endGame: false,
	notDead: true,
	beenHit: false,
	dead: false,
	soundEnabled: false,
	wave: 0,

	init: function() {
		var startOverlay = document.querySelector('#start-overlay');

		startOverlay.remove();

		// initiate the game components
		this.createShuttle();
		this.createAlien();
		this.moveElements();
		spaceInvaders.playSound(spaceInvaders.soundEnabled, '#backMusic');
	},

	playSound: function(sPlay, sound) {
		if (sPlay) {
			var asset = document.querySelector(sound);
			asset.play();
		}
	},

	createShuttle: function() {
		// create player shuttle
		this.shuttle = document.createElement('div');
		this.shuttle.setAttribute('id', 'shuttle');
		this.shuttle.style.position = 'absolute';
		this.shuttle.style.width = '100px';
		this.shuttle.style.height = '100px';
		this.shuttle.style.left = ((window.innerWidth / 2) - parseInt(this.shuttle.style.width, 10)) + 'px';
		this.shuttle.style.bottom = '10px';
		document.body.appendChild(this.shuttle);
		this.shuttleExhaust = document.createElement('div');
		this.shuttleExhaust.setAttribute('class', 'exhaust');
		this.shuttleExhaust.style.position = 'absolute';
		this.shuttle.appendChild(this.shuttleExhaust);
	},

	createAlien: function(alienColl) {
		var leftAlien = 10,
			topAlien = 10,
			alienColl = alienColl || 0,
			alienBunch = document.createDocumentFragment();

			if (alienColl) {
				alienColl = document.querySelectorAll(alienColl);
			}

		this.waveCounter();

		// create enemies

		for (var i = 0; i < (alienColl.length || 32); i++) {
			console.log(alienColl.length);
			if (alienColl) {
				this.enemy = alienColl[i];
			} else {
				this.enemy = document.createElement('div');
			}
			this.enemy.setAttribute('class', 'alien');
			this.enemy.style.position = 'absolute';
			this.enemy.style.width = '80px';
			this.enemy.style.height = '80px';
			this.enemy.style.background = 'url(images/alien' + (Math.floor(Math.random() * 7) + 1) + '.png) no-repeat';
			this.enemy.style.backgroundSize = '80px 80px';

			if (i % 8 === 0 && i != 0) {
				leftAlien = 10;
				topAlien += 100;
				this.enemy.style.top = topAlien + 'px';
				this.enemy.style.left = leftAlien + 'px';
				leftAlien = 110;
			} else {
				this.enemy.style.top = topAlien + 'px';
				this.enemy.style.left = leftAlien + 'px';
				leftAlien += 100;
			}

			if (!alienColl) {
				alienBunch.appendChild(this.enemy);
				document.body.appendChild(alienBunch);
			}
		}
	},

	moveElements: function() {
		var moveObj,
			aliens,
			vx = 0,
			Cx = 4,
			moveX = '',
			shuttleAccX = 1.0001,
			shuttleSpeed = 0,
			fire = false,
			bulletSpeed = 20,
			alienBulletSpeed = 20,
			bulletsArray = [],
			unusedBullets = [],
			alienBulletA = [],
			backgroundImage, computedBackground, moveBackground, spaceBacknb,
			createEnemyBullets,
			playerShuttle = spaceInvaders.shuttle;
			dir = true;

		backgroundImage = document.querySelector('.background-space');

		backgroundImage.style.width = window.innerWidth + 'px';
		backgroundImage.style.height = (window.innerHeight * 2) + 'px';
		backgroundImage.style.backgroundSize = window.innerWidth + 'px ' + (window.innerHeight * 2) + 'px';
		computedBackground = backgroundImage.getBoundingClientRect().top;

		moveBackground = -window.innerHeight;
		spaceBacknb = 1;

		onkeydown = function(e) {
			switch(e.which) {
				case 39:
					e.preventDefault();
					moveX = 'right';
					break;
				case 37:
					e.preventDefault();
					moveX = 'left';
					break;
				case 32:
					e.preventDefault();
					spaceInvaders.playSound(spaceInvaders.soundEnabled, '#shuttleFire');
					fire = true;
			}
		};

		onkeyup = function(e) {
			switch(e.which) {
				case 39:
					moveX = '';
					break;
				case 37:
					moveX = '';
					break;
			}
		};
		
		moveObj = setInterval(function() {
			if (spaceInvaders.endGame) return false;

			var leftShuttlePos = parseInt(spaceInvaders.shuttle.style.left, 10);
				aliens = document.querySelectorAll('.alien'),
				hit = false;

			if (computedBackground === window.innerHeight) {
				if (spaceBacknb === 3) spaceBacknb = 0;

				backgroundImage.style.top = 0;
				spaceBacknb++;
				backgroundImage.style.background = 'url(images/space-back-' + spaceBacknb + '.png)';
				backgroundImage.style.backgroundSize = window.innerWidth + 'px ' + (window.innerHeight * 2) + 'px';
				computedBackground = 0;
			}

			backgroundImage.style.backgroundPosition = '0px ' + moveBackground + 'px';
			moveBackground++;
			computedBackground++;

			// shuttle movement

			if (moveX === 'right' && shuttleSpeed > -5) {
				shuttleSpeed += shuttleAccX;
			} else if (moveX === 'left' && shuttleSpeed < 5) {
				shuttleSpeed -= shuttleAccX;
			} else {
				shuttleSpeed *= 0.5;
			}

			if ((leftShuttlePos + shuttleSpeed + spaceInvaders.shuttle.offsetWidth) 
				< window.innerWidth && leftShuttlePos + shuttleSpeed >= 0) 
			{
				spaceInvaders.shuttle.style.left = (leftShuttlePos + shuttleSpeed) + 'px';
			}

			// enemy movement

			[].forEach.call(aliens, function(alien) {
				var enemyLeftPos = parseInt(alien.style.left, 10);

				if (enemyLeftPos < 0) {
					console.log(enemyLeftPos);
					if (dir == false) Cx *= -1;
					dir = true;
					hit = true;
				} else if ((enemyLeftPos + alien.offsetWidth) > window.innerWidth) {
					if (dir == true) Cx *= -1;
					dir = false;
					hit = true;
				} 

				if (hit) {
					[].forEach.call(aliens, function(alien) {
						alien.style.top = (parseInt(alien.style.top, 10) + 15) + 'px';
					});	
				} 

				hit = false;
				
				alien.style.left = (enemyLeftPos + Cx) + 'px';

				if ((alien.getBoundingClientRect().top + alien.offsetHeight) > spaceInvaders.shuttle.getBoundingClientRect().top) {
					spaceInvaders.shuttle.style.background = 'url(images/explosion.png) no-repeat center';
					spaceInvaders.shuttle.style.backgroundSize = '100% 100%';
					spaceInvaders.endGame = true;
					setTimeout(function() {
						spaceInvaders.shuttle.remove();
					}, 100);

					if (!spaceInvaders.dead) {
						spaceInvaders.deadAction();
						spaceInvaders.dead = true;
					}

					overlay.style.opacity = 1;
					setTimeout(function() {
						window.location = '';
					}, 3000);
				}

			});

			// create player bullets

			if (fire && spaceInvaders.notDead) {
				var bullet,
					unusedBullets = document.querySelectorAll('.unused');

				if (unusedBullets.length > 0) {
					bullet = unusedBullets[0];
					bullet.setAttribute('class', 'bullet');
				} else {
					bullet = document.createElement('div');
					bullet.setAttribute('class', 'bullet');
					bullet.style.position = 'absolute';
					document.body.appendChild(bullet);
				}
				
				bullet.style.top = spaceInvaders.shuttle.offsetTop + 'px';
				bullet.style.left = (spaceInvaders.shuttle.offsetLeft + spaceInvaders.shuttle.offsetWidth / 2.4) + 'px';
			}

			fire = false;

			// shuttle fire

			var shuttleB = document.querySelectorAll('.bullet');

			[].forEach.call(shuttleB, function(shot) {
				if (parseInt(shot.getBoundingClientRect().top, 10) < 0) {
					shot.setAttribute('class', 'unused');
				}

				shot.style.top = (parseInt(shot.style.top, 10) - bulletSpeed) + 'px';

				[].forEach.call(aliens, function(alien) {
					spaceInvaders.hitAction(alien, shot, false, true);
				});
			});

			// enemy fire

			var alienB = document.querySelectorAll('.alien-bullet');

			[].forEach.call(alienB, function(alienShot) {
				if (parseInt(alienShot.getBoundingClientRect().top, 10) > window.innerHeight) {
					alienShot.setAttribute('class', 'unusedA');
				}

				alienShot.style.top = (parseInt(alienShot.style.top, 10) + alienBulletSpeed) + 'px';
				spaceInvaders.hitAction(playerShuttle, alienShot, true, false);
			});

			// waves

			if (aliens.length === 0) {
				Cx = Math.abs(Cx);
				Cx++;
				dir = true;
				spaceInvaders.createAlien('.dead-alien');
			}
		}, 33);	

		// create enemy bullets

		createEnemyBullets = setInterval(function() {
			if (spaceInvaders.endGame) return false;
			var unusedABullets = document.querySelectorAll('.unusedA');

			for (var i = 0, aliensL = aliens.length; i < aliensL; i++) {
				if (i === (Math.floor(Math.random() * aliens.length))) {
					if (unusedABullets.length > 0) {
						alienBullet = unusedABullets[0];
						alienBullet.setAttribute('class', 'alien-bullet');
					} else {
						alienBullet = document.createElement('div');
						alienBullet.setAttribute('class', 'alien-bullet');
						alienBullet.style.position = 'absolute';
						document.body.appendChild(alienBullet);
					}
					
					alienBullet.style.top = (aliens[i].getBoundingClientRect().top + aliens[i].offsetHeight) + 'px';
					alienBullet.style.left = (aliens[i].getBoundingClientRect().left + aliens[i].offsetWidth / 2) + 'px';
					spaceInvaders.playSound(spaceInvaders.soundEnabled, '#alienFire');
				}
			}
		}, 350);
	},

	hitAction: function(target, bullet, player, alien) {
		var overlay = document.querySelector('#overlay'),
		playerLifeInfo = document.querySelector('#lives'),
		playerScoreInfo = document.querySelector('#score');

		player = player || 0;
		alien = alien || 0;

		var targetCenterX = (parseInt(target.getBoundingClientRect().left) + (parseInt(target.offsetWidth) / 2)),
			targetCenterY = (parseInt(target.getBoundingClientRect().top) + (parseInt(target.offsetHeight) / 2)),
			bulletCenterX = (parseInt(bullet.getBoundingClientRect().left) + (parseInt(bullet.offsetWidth) / 2)),
			bulletCenterY = (parseInt(bullet.getBoundingClientRect().top) + (parseInt(bullet.offsetHeight) / 2)),
			targetDistanceX = Math.abs(targetCenterX - bulletCenterX),
			targetDistanceY = Math.abs(targetCenterY - bulletCenterY),
			targetRadius = parseInt(target.offsetWidth) / 2,
			bulletHeight = parseInt(bullet.offsetHeight),
			bulletWidth = parseInt(bullet.offsetWidth);

		if (targetDistanceX > (bulletWidth/2 + targetRadius) || targetDistanceY > (bulletHeight/2 + targetRadius)) {
			return false;
		} else if (targetDistanceX <= bulletWidth/2 || targetDistanceY <= bulletHeight/2) {
			target.style.background = 'url(images/explosion.gif) no-repeat center';
			target.style.backgroundSize = '100% 100%';

			if (player) {
				spaceInvaders.playSound(spaceInvaders.soundEnabled, '#shuttleEx');
				if (spaceInvaders.beenHit === false) {
					spaceInvaders.playerLife--;
					spaceInvaders.beenHit = true;
				}
				playerLifeInfo.innerHTML = 'Lives: ' + spaceInvaders.playerLife;
				spaceInvaders.notDead = false;

				setTimeout(function() {
					target.style.background = 'url(images/bgbattleship.png) no-repeat center';
					target.style.backgroundSize = '100% 100%';
					spaceInvaders.notDead = true;
					spaceInvaders.beenHit = false;
				}, 1000);
				if (spaceInvaders.playerLife === 0) {
					spaceInvaders.endGame = true;
					setTimeout(function() {
						target.remove();
					}, 500);

					spaceInvaders.deadAction();

					overlay.style.opacity = 1;
					setTimeout(function() {
						window.location = '';
					}, 3000);
				}
			}

			if (alien) {
				spaceInvaders.playSound(spaceInvaders.soundEnabled, '#alienEx');
				if (!target.classList.contains('hit-alien')) {
					spaceInvaders.playerScore += 100;
					target.classList.add('hit-alien');
				}
				playerScoreInfo.innerHTML = 'Score: ' + spaceInvaders.playerScore;
				setTimeout(function() {
					target.style.top = '9999px';
					target.setAttribute('class', 'dead-alien');
				}, 500);
			}

			bullet.setAttribute('class', 'unused');
			bullet.style.top = -11 + 'px';
		}

		var cornerDistance_sq = (targetDistanceX - bulletWidth/2) * (targetDistanceX - bulletWidth/2) +
		 (targetDistanceY - bulletHeight/2) * (targetDistanceY - bulletHeight/2);

		return (cornerDistance_sq <= (targetRadius * targetRadius));
	},

	deadAction: function() {
		var playerName = prompt('What is your name?');

		if (!playerName) playerName = 'Mistery';

		playerAddInfo(playerName, spaceInvaders.wave, spaceInvaders.playerScore);
	},

	waveCounter: function() {
		var waveContainer = document.querySelector('#wave-message'),
			waveInfo = document.querySelector('#wave-info');

		spaceInvaders.wave++;

		waveInfo.innerHTML = 'Wave: ' + spaceInvaders.wave;
		waveContainer.style.display = 'block';
		waveContainer.innerHTML = 'Wave: ' + spaceInvaders.wave;

		setTimeout(function() {
			waveContainer.style.display = 'none';
		}, 3000);
	}
}