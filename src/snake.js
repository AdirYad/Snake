const canvas = document.querySelector('#snake');
const context = canvas.getContext('2d');

// UNIT
const box = 32;

// LOAD IMAGES
const groundImg = new Image();
groundImg.src = 'img/ground.png';

const foodImg = new Image();
foodImg.src = 'img/food.png';

// AUDIO
const deadAudio = new Audio('audio/dead.mp3');
const downAudio = new Audio('audio/down.mp3');
const eatAudio = new Audio('audio/eat.mp3');
const leftAudio = new Audio('audio/left.mp3');
const rightAudio = new Audio('audio/right.mp3');
const upAudio = new Audio('audio/up.mp3');

// SNAKE
let snake = [];
snake[0] = {
	x: 9 * box,
	y: 10 * box
};

// FOOD
let food = {
	x: Math.floor(Math.random() * 17 + 1) * box,
	y: Math.floor(Math.random() * 15 + 3) * box
};

// SCORE
let score = 0;

// CONTROLS
document.addEventListener('keydown', changeDirection);

let direction = 'right';
function changeDirection(event) {
	if(game !== null) {
		if(event.keyCode === 37 && direction !== 'right') {
			direction = 'left';
			leftAudio.play();
		} else if(event.keyCode === 38 && direction !== 'down') {
			direction = 'up';
			upAudio.play();
		} else if(event.keyCode === 39 && direction !== 'left') {
			direction = 'right';
			rightAudio.play();
		} else if(event.keyCode === 40 && direction !== 'up') {
			direction = 'down';
			downAudio.play();
		}
	}
}

function snakeTouchedHimself(head, snake) {
	for(let index = 0; index < snake.length; index++) {
		if(head.x === snake[index].x && head.y === snake[index].y) {
			console.log('Head: ', head);
			console.log('Item: ', snake[index]);
			console.log('Index: ', index);
			return true;
		} 
	}
	return false;
}

// DRAWS
function draw() {
	// DRAW GROUNDS 
	context.drawImage(groundImg, 0, 0);

	// DRAW FOOD
	context.drawImage(foodImg, food.x, food.y);

	// DRAW SCORE
	context.fillStyle = '#fff';
	context.font = '32px Arial';
	context.fillText(score, 2 * box, 1.6 * box);

	// DRAW SNAKE
	snake.forEach((item, index) => {
		context.fillStyle = 'green';
		if(index === 0) {
			context.strokeStyle = '#EF6C00';
		} else {
			context.strokeStyle = '#000';
		}

		context.strokeRect(item.x, item.y, box, box);
		context.fillRect(item.x, item.y, box, box);
	});

	// SNAKE MOVEMENT
	let oldHeadX = snake[0].x;
    let oldHeadY = snake[0].y;

	if(direction === 'left') oldHeadX -= box;
	if(direction === 'up') oldHeadY -= box;
	if(direction === 'right') oldHeadX += box;
	if(direction === 'down') oldHeadY += box;

	// EAT FOOD
	if(oldHeadX === food.x && oldHeadY === food.y) {
		score++;
		eatAudio.play();
		food = {
			x: Math.floor(Math.random() * 17 + 1) * box,
			y: Math.floor(Math.random() * 15 + 3) * box
		};
	} else {
		snake.pop();
	}

	const newHead = {
		x: oldHeadX,
		y: oldHeadY
	};
	
	// GAME OVER
	if(oldHeadX < box || oldHeadY < 3 * box || oldHeadX > 17 * box || oldHeadY > 17 * box || snakeTouchedHimself(newHead, snake)) {
		clearInterval(game);
		deadAudio.play();
		game = null;
	}

	snake.unshift(newHead);
};

let game = setInterval(draw, 100);