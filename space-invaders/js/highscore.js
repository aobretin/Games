var playerAddInfo, playerInfo;

playerAddInfo = function(name, wave, score) {
	var	infoA = [],
		infoArray = [],
		oldData = [];

	infoA.push(name, wave, score);
	oldData = JSON.parse(window.localStorage.getItem('infoArray'));

	if (oldData != undefined) {
		for (var i = 0; i < oldData.length; i++) {
			infoArray.push(oldData[i]);
		}
	}

	infoArray.push(infoA);
	window.localStorage.setItem('infoArray', JSON.stringify(infoArray));
}

playerInfo = function() {
	var elementholder,
		buttonholder = document.querySelector('#buttons-holder'),
		scoreholder = document.querySelector('#highscore-holder');

	buttonholder.style.display = 'none';
	scoreholder.style.display = 'block';

	if (!window.localStorage.getItem('infoArray')) {
        window.localStorage.setItem('infoArray', '[]');
        infoArray = [];
    } else {
        infoArray = JSON.parse(window.localStorage.getItem('infoArray'));
    }

    infoArray.reverse();

    if (infoArray.length === 0) {
    	scoreholder.innerHTML = '<p>No highscores!!!</p>';
    } else if (infoArray.length > 10) {
    	infoArray.splice(infoArray.length -1, 1);
    }

	for (var i = 0; i < infoArray.length; i++) {
		elementholder = document.createElement('div');
		elementholder.setAttribute('class', 'highscore-lane');
		for (var y = 0; y < infoArray[i].length; y++) {
			var element = document.createElement('span');
			element.innerHTML = infoArray[i][y];
			elementholder.appendChild(element);
		}
		scoreholder.appendChild(elementholder);
	}
}

