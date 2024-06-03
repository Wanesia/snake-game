const gameBoard = document.querySelector("#game-board");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score-text");
const resetBtn = document.querySelector("#reset-btn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
let foodColor = "red";
let directionsInverted = false;
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let xFood;
let yFood;
let score = 0;
let snake = [
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = "Score: " + score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            moveSnake();
            drawSnake();
            drawFood();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    xFood = Math.floor(Math.random() * ((gameWidth - unitSize) - 0 + 1) / unitSize) * unitSize;
    yFood = Math.floor(Math.random() * ((gameHeight - unitSize) - 0 + 1) / unitSize) * unitSize;
    const isBlackFood = Math.random() < 0.6;

    foodColor = isBlackFood ? 'black' : 'red';
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(xFood, yFood, unitSize, unitSize);
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};

    snake.unshift(head);

    if (snake[0].x === xFood && snake[0].y === yFood) {
        score += 1;
        scoreText.textContent = "Score: " + score;
        checkFoodCollision();
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function checkFoodCollision() {
    if (foodColor === 'black') {
        directionsInverted = true;
    } else if (foodColor === 'red') {
        directionsInverted = false;
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if (directionsInverted) {
        switch (true) {
            case (keyPressed == LEFT && !goingLeft):
                xVelocity = unitSize;
                yVelocity = 0;
                break;
            case (keyPressed == UP && !goingUp):
                xVelocity = 0;
                yVelocity = unitSize;
                break;
            case (keyPressed == RIGHT && !goingRight):
                xVelocity = -unitSize;
                yVelocity = 0;
                break;
            case (keyPressed == DOWN && !goingDown):
                xVelocity = 0;
                yVelocity = -unitSize;
                break;
        }
    } else {
        switch (true) {
            case (keyPressed == LEFT && !goingRight):
                xVelocity = -unitSize;
                yVelocity = 0;
                break;
            case (keyPressed == UP && !goingDown):
                xVelocity = 0;
                yVelocity = -unitSize;
                break;
            case (keyPressed == RIGHT && !goingLeft):
                xVelocity = unitSize;
                yVelocity = 0;
                break;
            case (keyPressed == DOWN && !goingUp):
                xVelocity = 0;
                yVelocity = unitSize;
                break;
        }
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    directionsInverted = false;
    gameStart();
}
