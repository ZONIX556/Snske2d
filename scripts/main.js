let scoreBlock; //Вывод блока очков
let score = 0; //Счётчик очков

const config = {
	step: 0, //Шаг
	maxStep: 6, //Макс. шаг
	sizeCell: 16, // Размер ячейки
	sizeBerry: 16 / 4 // Размер ягоды
}

const snake = { // Змейка
	x: 160, // Координата x
	y: 160, // Координата y
	dx: config.sizeCell, // Скорость
	dy: 0, // Скорость
	tails: [], 
	maxTails: 3
}

let berry = { //Ягода
	x: 0,
	y: 0
} 


let canvas = document.querySelector("#game-canvas"); //Полотно
let context = canvas.getContext("2d"); //Контекст полотна
scoreBlock = document.querySelector(".game-score .score-count"); //Размещение очков
drawScore(); //Функция отрисовки очков

function incScore() { //Увеличение очков
	score++;
	drawScore();
}

function drawScore() { //Отрисовка очков
	scoreBlock.innerHTML = score;
}
function gameLoop() { // Анимация

	requestAnimationFrame( gameLoop ); //Отрисовка игры
	if ( ++config.step < config.maxStep) {
		return;
	}
	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height); //Отчистка полотна

	drawBerry(); //Рисование ягоды
	drawSnake(); //Рисование змейки
}
requestAnimationFrame( gameLoop );

function drawSnake() { //Рисование змейки
	snake.x += snake.dx; //Рисует змейку по оси x
	snake.y += snake.dy; //Рисует змейку по оси y

	collisionBorder();

	// todo бордер
	snake.tails.unshift( { x: snake.x, y: snake.y } ); // скрывает змейку которая проходит через границу карты

	if ( snake.tails.length > snake.maxTails ) { // Если длина хвоста больше maxTails вызвать функцию
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){ //Цвет змейки (Голова index = 0 и тело)
		if (index == 0) { //Если index = 0, значит голова
			context.fillStyle = "#FA0556"; //Цвет головы
		} else { //Если index != 0, значит тело
			context.fillStyle = "#AA00154"; //Цвет тела
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell ); //Отрисовка цвета
		if ( el.x === berry.x && el.y === berry.y ) { //Увелечение очков и перерисовка ягоды (Змейка съела ягоду)
			snake.maxTails++; //Увеличить хвост
			incScore();//Увеличить очки
			randomPositionBerry(); //Переспавнить вишню
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) { // Если змейка съела себя

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
				refreshGame();
			}

		}

	} );
}

function collisionBorder() { //Отрисовка змейки с другой стороны
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}
function refreshGame() { // Обновление игры(перезапуск)
	score = 0; //Сброс очков
	drawScore(); // Отрисовка очков

	snake.x = 160; // Начальное положение x
	snake.y = 160;// Начальное положение y
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry(); //Случайное положение ягоды
}

function drawBerry() { // Отрисовка ягоды 
	context.beginPath();
	context.fillStyle = "#A00034"; // Цвет ягоды
	context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI ); // Размер ягоды
	context.fill(); //Нарисовать
}

function randomPositionBerry() { // Случайная позиция ягоды
	berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function getRandomInt(min, max) { //Функция случайных числе
	return Math.floor( Math.random() * (max - min) + min );
}

document.addEventListener("keydown", function (e) { //Управление
	if ( e.code == "KeyW" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});