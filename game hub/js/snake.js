// ==========================================
// SNAKE GAME
// ==========================================

const canvas =
    document.getElementById("snakeCanvas");

const ctx =
    canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const bestElement =
    document.getElementById("best");

const newGameButton =
    document.getElementById("newGame");

const restartButton =
    document.getElementById("restartButton");

const gameOverElement =
    document.getElementById("gameOver");

const finalScoreElement =
    document.getElementById("finalScore");


// ==========================================
// SETTINGS
// ==========================================

const gridSize = 25;

const tileCount =
    canvas.width / gridSize;

let snake = [];

let food = {};

let direction = "right";

let nextDirection = "right";

let score = 0;

let bestScore =
    Number(localStorage.getItem("snakeBest")) || 0;

let gameLoop = null;

let gameRunning = false;


// ==========================================
// START GAME
// ==========================================

function startGame() {

    snake = [

        {
            x: 10,
            y: 10
        },

        {
            x: 9,
            y: 10
        },

        {
            x: 8,
            y: 10
        }

    ];


    direction = "right";

    nextDirection = "right";

    score = 0;

    gameRunning = true;

    gameOverElement.classList.remove("show");

    createFood();

    updateScore();

    clearInterval(gameLoop);

    gameLoop = setInterval(
        gameUpdate,
        100
    );

    draw();

}


// ==========================================
// GAME UPDATE
// ==========================================

function gameUpdate() {

    direction = nextDirection;


    const head = {
        x: snake[0].x,
        y: snake[0].y
    };


    // Move

    if (direction === "up") {
        head.y--;
    }

    if (direction === "down") {
        head.y++;
    }

    if (direction === "left") {
        head.x--;
    }

    if (direction === "right") {
        head.x++;
    }


    // Wall collision

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {

        endGame();

        return;

    }


    // Self collision

    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            endGame();

            return;

        }

    }


    snake.unshift(head);


    // Food collision

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        updateScore();

        createFood();

    } else {

        snake.pop();

    }


    draw();

}


// ==========================================
// DRAW
// ==========================================

function draw() {

    // Background

    ctx.fillStyle = "#101827";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grid

    drawGrid();


    // Food

    drawFood();


    // Snake

    drawSnake();

}


// ==========================================
// GRID
// ==========================================

function drawGrid() {

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


// ==========================================
// DRAW SNAKE
// ==========================================

function drawSnake() {

    snake.forEach(
        (part, index) => {

            if (index === 0) {

                ctx.fillStyle =
                    "#65e58b";

            } else {

                ctx.fillStyle =
                    "#32c866";

            }


            drawRoundedRect(
                part.x * gridSize + 2,
                part.y * gridSize + 2,
                gridSize - 4,
                gridSize - 4,
                5
            );

        }
    );

}


// ==========================================
// DRAW FOOD
// ==========================================

function drawFood() {

    const centerX =
        food.x * gridSize +
        gridSize / 2;

    const centerY =
        food.y * gridSize +
        gridSize / 2;


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff5575";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX - 2,
        centerY - 2,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff9aad";

    ctx.fill();

}


// ==========================================
// ROUNDED RECTANGLE
// ==========================================

function drawRoundedRect(
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        width,
        height,
        radius
    );

    ctx.fill();

}


// ==========================================
// CREATE FOOD
// ==========================================

function createFood() {

    let validPosition = false;


    while (!validPosition) {

        food = {

            x: Math.floor(
                Math.random() *
                tileCount
            ),

            y: Math.floor(
                Math.random() *
                tileCount
            )

        };


        validPosition =
            !snake.some(
                part =>
                    part.x === food.x &&
                    part.y === food.y
            );

    }

}


// ==========================================
// SCORE
// ==========================================

function updateScore() {

    scoreElement.textContent =
        score;


    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "snakeBest",
            bestScore
        );

    }


    bestElement.textContent =
        bestScore;

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    finalScoreElement.textContent =
        score;

    gameOverElement.classList.add(
        "show"
    );

}


// ==========================================
// CHANGE DIRECTION
// ==========================================

function changeDirection(
    newDirection
) {

    if (!gameRunning) {
        return;
    }


    // Prevent 180-degree turns

    if (
        newDirection === "up" &&
        direction !== "down"
    ) {

        nextDirection = "up";

    }


    if (
        newDirection === "down" &&
        direction !== "up"
    ) {

        nextDirection = "down";

    }


    if (
        newDirection === "left" &&
        direction !== "right"
    ) {

        nextDirection = "left";

    }


    if (
        newDirection === "right" &&
        direction !== "left"
    ) {

        nextDirection = "right";

    }

}


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        const directions = {

            ArrowUp: "up",

            ArrowDown: "down",

            ArrowLeft: "left",

            ArrowRight: "right"

        };


        if (
            directions[event.key]
        ) {

            event.preventDefault();

            changeDirection(
                directions[event.key]
            );

        }

    }
);


// ==========================================
// MOBILE BUTTONS
// ==========================================

const mobileButtons =
    document.querySelectorAll(
        ".mobile-controls button"
    );


mobileButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            changeDirection(
                button.dataset.direction
            );

        }
    );

});


// ==========================================
// NEW GAME
// ==========================================

newGameButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


// ==========================================
// SWIPE CONTROLS
// ==========================================

let touchStartX = 0;

let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    function(event) {

        const touchEndX =
            event.changedTouches[0].clientX;

        const touchEndY =
            event.changedTouches[0].clientY;


        const differenceX =
            touchEndX - touchStartX;

        const differenceY =
            touchEndY - touchStartY;


        if (
            Math.abs(differenceX) <
            30 &&
            Math.abs(differenceY) <
            30
        ) {

            return;

        }


        if (
            Math.abs(differenceX) >
            Math.abs(differenceY)
        ) {

            if (differenceX > 0) {

                changeDirection("right");

            } else {

                changeDirection("left");

            }

        } else {

            if (differenceY > 0) {

                changeDirection("down");

            } else {

                changeDirection("up");

            }

        }

    },
    {
        passive: true
    }
);


// ==========================================
// START
// ==========================================

startGame();