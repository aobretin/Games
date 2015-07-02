var puzzle, i, y, t, input, image, imageChecker,
	input = document.querySelector('#image-src'),
	startMoves = false,
	piecesHolder = document.querySelector('#pieces-holder');
	overlay = document.querySelector('.overlay'),
	moves = 50;

	Array.prototype.equals = function (array) {
	    if (!array)
	        return false;

	    if (this.length != array.length)
	        return false;

	    for (var i = 0, l=this.length; i < l; i++) {
	        if (this[i] instanceof Array && array[i] instanceof Array) {
	            if (!this[i].equals(array[i]))
	                return false;       
	        }           
	        else if (this[i] != array[i]) { 
	            return false;   
	        }           
	    }       
	    return true;
	}

	function shuffle(array) {
	    var currentIndex = array.length, temporaryValue, randomIndex;

	    while (0 !== currentIndex) {
	       randomIndex = Math.floor(Math.random() * currentIndex);
	       currentIndex -= 1;

	       temporaryValue = array[currentIndex];
	       array[currentIndex] = array[randomIndex];
	       array[randomIndex] = temporaryValue;
	    }

	    return array;
	}

	// if succes = true, show succes msg, else if succes is equal to false show fail message;

	function completeOver(succes) {
		var messages = document.querySelectorAll('h2');

		overlay.style.top = 0;

		if (succes) {
			document.querySelector('.succes').style.display = 'block';
		} else {
			document.querySelector('.fail').style.display = 'block';
		}

		for (i = 0; i < messages.length; i++) {
			messages[i].addEventListener('click', function() {
				window.location.href = '';
			});
		}
	}

	function piecePreview(piece) {
		var preview = document.querySelector('#piece-preview');

		preview.style.background = puzzle.puzzleBoard.style.background;

		piece.addEventListener('mouseenter', function() {
			preview.style.transform = 'scale(2.5)';
			preview.style.backgroundPosition = piece.style.backgroundPosition;
		});

		piecesHolder.addEventListener('mouseleave', function() {
			preview.style.transform = 'scale(0)';
		});
	}

input.focus();

puzzle = {
	initialOrder: new Array(),

	init: function(image) {
		this.makePuzzle(image);
	},

	makePuzzle: function(image) {
		var positionX = 0,
			positionY = 0,
			errorMsg = document.querySelector('.input-error');

		input.addEventListener('blur', function() {
			imageChecker = new RegExp('.jpg|.png|.gif');
			image = input.value;

			if (image.length == 0 || !imageChecker.test(image)) {
				errorMsg.style.display = 'block';
				input.classList.add('error-class');
				return;
			}

			errorMsg.style.display = 'none';
			input.classList.remove('error-class');
			puzzle.init(image);
		});

		input.addEventListener('focus', function() {
			input.value = '';
			errorMsg.style.display = 'none';
			input.classList.remove('error-class');
		});

		this.puzzleBoard = document.querySelector('#puzzle-image');
		this.puzzleBoard.style.display = 'inline-block';
		this.puzzleBoard.style.width = '400px';
		this.puzzleBoard.style.height = '499px';
		this.puzzleBoard.style.borderRadius = '10px';
		this.puzzleBoard.style.background = '#fff';

		if (typeof image === 'undefined') {
			this.puzzleBoard.innerHTML = '<span>Please insert an image</span>';
			document.querySelector('#pieces-holder').style.display = 'none';
			document.querySelector('#solve').style.display = 'none';
			document.querySelector('#refresh').style.display = 'none';
			document.querySelector('#show_clue').style.display = 'none';
			document.querySelector('#mix').style.display = 'none';
			return;
		} else {
			this.puzzleBoard.innerHTML = '';
			piecesHolder.style.display = 'inline-block';
			this.puzzleBoard.style.background = 'url(' + image + ') no-repeat center';
			document.querySelector('#mix').style.display = 'inline-block';
			input.style.display = 'none';

			for (i = 0; i < 30; i++) {
				this.piece = document.createElement('div');
				this.piece.setAttribute('class', 'piece');
				this.piece.style.width = '80px';
				this.piece.style.height = '83px';
				this.piece.style.cssFloat = 'left';
				this.piece.style.background = 'url(' + image + ') no-repeat center';
				this.piece.style.outline = '1px solid #fff';
				this.piece.setAttribute('draggable', 'true');

				if (i % 5 === 0 && i != 0) {
					positionX = 0;
					positionY -= 83;
					this.piece.style.backgroundPosition = positionX + 'px ' + positionY + 'px';
					positionX = -80;
				} else {
					this.piece.style.backgroundPosition = positionX + 'px ' + positionY + 'px';
					positionX -= 80;
				}
				piecesHolder.appendChild(this.piece);
			}

			var puzzlePieces = document.querySelectorAll('#pieces-holder .piece');

			for (i = 0; i < puzzlePieces.length; i++) {
				this.initialOrder.push(puzzlePieces[i].style.backgroundPosition);
			}

		}
	},

	drag: function() {
		var puzzlePieces = document.querySelectorAll('#pieces-holder .piece'),
			dragSrcEl;

		function handleDragStart(event) {
			this.style.opacity = '0.4';

			dragSrcEl = this;

			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/css', this.style.backgroundPosition);
		}

		function handleDragOver(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}

			event.dataTransfer.dropEffect = 'move';

			return false;
		}

		function handleDragEnter(event) {
			this.classList.add('over');
		}

		function handleDragLeave(event) {
			this.classList.remove('over');
		}

		function handleDrop(event) {
			var checkOrder = [];

			if (event.stopPropagation) {
				event.stopPropagation();
			}

			if (startMoves && dragSrcEl != this) {
				dragSrcEl.style.backgroundPosition = this.style.backgroundPosition;
				this.style.backgroundPosition = event.dataTransfer.getData('text/css');

				document.querySelector('#show_clue').style.display = 'inline-block';
				moves--;
				document.querySelector('.moves').innerHTML = 'Moves left: <span>' + moves + '</span>';

				if (moves == 0) {
					completeOver(false);
					for (i = 0; i < puzzlePieces.length; i++) {
						puzzlePieces[i].style.backgroundPosition = puzzle.initialOrder[i];
					}

					return false;
				} else if (moves <= 3) {
					document.querySelector('#show_clue').disabled = true;
				}
			}

			for (i = 0; i < puzzlePieces.length; i++) {
				checkOrder.push(puzzlePieces[i].style.backgroundPosition);
			}

			if (checkOrder.equals(puzzle.initialOrder)) {
				completeOver(true);
			}

			return false;
		}

		function handleDragEnd(event) {
			this.style.opacity = '1';
			for (y = 0; y < puzzlePieces.length; y++) {
				puzzlePieces[y].classList.remove('over');
			}
		}

		for (i = 0; i < puzzlePieces.length; i++) {
			puzzlePieces[i].addEventListener('dragstart', handleDragStart, false);
			puzzlePieces[i].addEventListener('dragenter', handleDragEnter, false);
			puzzlePieces[i].addEventListener('dragover', handleDragOver, false);
			puzzlePieces[i].addEventListener('dragleave', handleDragLeave, false);
			puzzlePieces[i].addEventListener('drop', handleDrop, false);
			puzzlePieces[i].addEventListener('dragend', handleDragEnd, false);
		}
	},

	mixPuzzle: function() {
		var puzzlePieces = document.querySelectorAll('#pieces-holder .piece'),
			mixBacks = [];
			mixElements = [];

		startMoves = true;

		this.puzzleBoard.style.display = 'none';
		piecesHolder.style.marginLeft = 0;

		document.querySelector('#solve').style.display = 'inline-block';
		document.querySelector('#refresh').style.display = 'inline-block';
		document.querySelector('#mix').disabled = true;
		document.querySelector('#show_clue').disabled = false;

		for (y = 0; y < puzzlePieces.length; y++) {
			mixBacks.push(puzzlePieces[y].style.backgroundPosition);
		}

		mixElements = shuffle(mixBacks);

		for (i = 0; i < mixElements.length; i++) {
			puzzlePieces[i].style.backgroundPosition = mixBacks[i];
		}

		this.drag();

		for (t = 0; t < puzzlePieces.length; t++) {
			piecePreview(puzzlePieces[t]);
		}
	},

	solvePuzzle: function() {
		var puzzlePieces = document.querySelectorAll('#pieces-holder .piece');

		for (i = 0; i < puzzlePieces.length; i++) {
			puzzlePieces[i].style.backgroundPosition = this.initialOrder[i];
		}

		overlay.style.top = 0;
		overlay.style.opacity = '0.2';

		setTimeout(function() {
			window.location.href = '';
		}, 5000);
	},

	showClue: function() {
		if (!this.puzzleBoard.classList.contains('show-clue')) {
			this.puzzleBoard.classList.add('show-clue');
			this.puzzleBoard.style.display = 'inline-block';
			piecesHolder.style.marginLeft = '46px';
			moves = moves - 3;
			document.querySelector('.moves').innerHTML = 'Moves left: <span>' + moves + '</span>';
			setTimeout(function() {
				puzzle.showClue();
			}, 10000);
			document.querySelector('#show_clue').disabled = true;
		} else if (moves <= 3) {
			this.puzzleBoard.classList.remove('show-clue');
			this.puzzleBoard.style.display = 'none';
			piecesHolder.style.marginLeft = 0;
			document.querySelector('#show_clue').disabled = true;
			return;
		} else {
			this.puzzleBoard.classList.remove('show-clue');
			this.puzzleBoard.style.display = 'none';
			piecesHolder.style.marginLeft = 0;
			document.querySelector('#show_clue').disabled = false;
		}
	}
}

puzzle.init();