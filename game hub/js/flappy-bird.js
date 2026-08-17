// ==========================================
// FLAPPY BIRD GAME
// ==========================================

const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");

const newGameButton = document.getElementById("newGame");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

const finalScoreElement =
    document.getElementById("finalScore");


// ==========================================
// GAME SETTINGS
// ==========================================

const gravity = 0.42;

const jumpStrength = -7.2;

const pipeWidth = 70;

const pipeGap = 160;

const pipeSpeed = 2.8;

const pipeDistance = 230;


// ==========================================
// GAME VARIABLES
// ==========================================

let bird;

let pipes = [];

let score = 0;

let bestScore =
    Number(localStorage.getItem("flappyBest")) || 0;

let gameRunning = false;

let animationId = null;


// ==========================================
// CREATE BIRD
// ==========================================

function createBird() {

    bird = {

        x: 110,

        y: 300,

        width: 32,

        height: 25,

        velocity: 0,

        rotation: 0

    };

}


// ==========================================
// RESET GAME
// ==========================================

function resetGame() {

    createBird();

    pipes = [];

    score = 0;

    scoreElement.textContent = score;

    bestElement.textContent = bestScore;

}


// ==========================================
// START GAME
// ==========================================

function startGame() {

    resetGame();

    gameRunning = true;

    startScreen.style.display = "none";

    gameOverElement.classList.remove("show");

    cancelAnimationFrame(animationId);

    gameLoop();

}


// ==========================================
// BIRD FLAP
// ==========================================

function flap() {

    if (!gameRunning) {
        return;
    }

    bird.velocity = jumpStrength;

}


// ==========================================
// CREATE PIPE
// ==========================================

function createPipe() {

    const minTop = 70;

    const maxTop =
        canvas.height -
        pipeGap -
        100;


    const topHeight =
        Math.floor(
            Math.random() *
            (maxTop - minTop)
        ) + minTop;


    pipes.push({

        x: canvas.width + 20,

        top: topHeight,

        bottom: topHeight + pipeGap,

        scored: false

    });

}


// ==========================================
// UPDATE GAME
// ==========================================

function update() {

    // --------------------------------------
    // BIRD PHYSICS
    // --------------------------------------

    bird.velocity += gravity;

    bird.y += bird.velocity;


    bird.rotation =
        Math.min(
            bird.velocity * 0.08,
            0.6
        );


    // --------------------------------------
    // MOVE PIPES
    // --------------------------------------

    for (
        let i = pipes.length - 1;
        i >= 0;
        i--
    ) {

        pipes[i].x -= pipeSpeed;


        // ----------------------------------
        // SCORE
        // ----------------------------------

        if (
            !pipes[i].scored &&
            pipes[i].x + pipeWidth < bird.x
        ) {

            pipes[i].scored = true;

            score++;

            scoreElement.textContent = score;

            updateBestScore();

        }


        // ----------------------------------
        // REMOVE OLD PIPE
        // ----------------------------------

        if (
            pipes[i].x + pipeWidth < 0
        ) {

            pipes.splice(i, 1);

        }

    }


    // --------------------------------------
    // CREATE NEW PIPES
    // --------------------------------------

    if (pipes.length === 0) {

        createPipe();

    }

    else {

        const lastPipe =
            pipes[pipes.length - 1];


        if (
            canvas.width -
            lastPipe.x >=
            pipeDistance
        ) {

            createPipe();

        }

    }


    // --------------------------------------
    // CHECK COLLISION
    // --------------------------------------

    if (checkCollision()) {

        endGame();

    }

}


// ==========================================
// COLLISION DETECTION
// ==========================================

function checkCollision() {

    const birdLeft =
        bird.x + 5;

    const birdRight =
        bird.x +
        bird.width -
        5;

    const birdTop =
        bird.y + 5;

    const birdBottom =
        bird.y +
        bird.height -
        5;


    // --------------------------------------
    // GROUND COLLISION
    // --------------------------------------

    if (
        birdBottom >=
        canvas.height - 35
    ) {

        return true;

    }


    // --------------------------------------
    // CEILING COLLISION
    // --------------------------------------

    if (
        birdTop <= 0
    ) {

        return true;

    }


    // --------------------------------------
    // PIPE COLLISION
    // --------------------------------------

    for (const pipe of pipes) {

        const pipeLeft =
            pipe.x;

        const pipeRight =
            pipe.x +
            pipeWidth;


        const horizontalCollision =
            birdRight > pipeLeft &&
            birdLeft < pipeRight;


        const verticalCollision =
            birdTop < pipe.top ||
            birdBottom > pipe.bottom;


        if (
            horizontalCollision &&
            verticalCollision
        ) {

            return true;

        }

    }


    return false;

}


// ==========================================
// DRAW EVERYTHING
// ==========================================

function draw() {

    drawBackground();

    drawClouds();

    drawPipes();

    drawGround();

    drawBird();

}


// ==========================================
// BACKGROUND
// ==========================================

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#62c8ef"
    );

    gradient.addColorStop(
        1,
        "#b6ecff"
    );


    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


// ==========================================
// CLOUDS
// ==========================================

function drawClouds() {

    ctx.fillStyle =
        "rgba(255,255,255,0.65)";


    drawCloud(
        90,
        110,
        0.8
    );


    drawCloud(
        350,
        190,
        0.65
    );


    drawCloud(
        250,
        60,
        0.5
    );

}


function drawCloud(
    x,
    y,
    scale
) {

    ctx.beginPath();


    ctx.arc(
        x,
        y,
        25 * scale,
        0,
        Math.PI * 2
    );


    ctx.arc(
        x + 25 * scale,
        y - 10 * scale,
        30 * scale,
        0,
        Math.PI * 2
    );


    ctx.arc(
        x + 55 * scale,
        y,
        23 * scale,
        0,
        Math.PI * 2
    );


    ctx.fill();

}


// ==========================================
// DRAW PIPES
// ==========================================

function drawPipes() {

    pipes.forEach(pipe => {

        // TOP PIPE

        drawPipe(
            pipe.x,
            0,
            pipeWidth,
            pipe.top,
            true
        );


        // BOTTOM PIPE

        drawPipe(
            pipe.x,
            pipe.bottom,
            pipeWidth,
            canvas.height -
            pipe.bottom,
            false
        );

    });

}


// ==========================================
// DRAW SINGLE PIPE
// ==========================================

function drawPipe(
    x,
    y,
    width,
    height,
    topPipe
) {

    // Main pipe

    ctx.fillStyle = "#45b84a";


    ctx.fillRect(
        x,
        y,
        width,
        height
    );


    // Light side

    ctx.fillStyle = "#5ed660";


    ctx.fillRect(
        x + 8,
        y,
        12,
        height
    );


    // Dark side

    ctx.fillStyle = "#318e36";


    ctx.fillRect(
        x + width - 10,
        y,
        10,
        height
    );


    // --------------------------------------
    // PIPE CAP
    // --------------------------------------

    const capHeight = 22;

    const capX = x - 5;

    const capWidth =
        width + 10;


    let capY;


    if (topPipe) {

        capY =
            height -
            capHeight;

    }

    else {

        capY = y;

    }


    ctx.fillStyle =
        "#45b84a";


    ctx.fillRect(
        capX,
        capY,
        capWidth,
        capHeight
    );


    ctx.strokeStyle =
        "#318e36";


    ctx.lineWidth = 2;


    ctx.strokeRect(
        capX,
        capY,
        capWidth,
        capHeight
    );

}


// ==========================================
// DRAW GROUND
// ==========================================

function drawGround() {

    const groundHeight = 35;


    // Dirt

    ctx.fillStyle =
        "#d9c36a";


    ctx.fillRect(
        0,
        canvas.height -
        groundHeight,
        canvas.width,
        groundHeight
    );


    // Grass

    ctx.fillStyle =
        "#82c94a";


    ctx.fillRect(
        0,
        canvas.height -
        groundHeight,
        canvas.width,
        8
    );


    // Grass lines

    ctx.strokeStyle =
        "#65a83c";


    ctx.lineWidth = 2;


    for (
        let x = 0;
        x < canvas.width;
        x += 25
    ) {

        ctx.beginPath();


        ctx.moveTo(
            x,
            canvas.height -
            groundHeight
        );


        ctx.lineTo(
            x + 15,
            canvas.height
        );


        ctx.stroke();

    }

}


// ==========================================
// DRAW BIRD
// ==========================================

function drawBird() {

    ctx.save();


    ctx.translate(
        bird.x +
        bird.width / 2,
        bird.y +
        bird.height / 2
    );


    ctx.rotate(
        bird.rotation
    );


    // --------------------------------------
    // BODY
    // --------------------------------------

    ctx.fillStyle =
        "#ffd93d";


    ctx.beginPath();


    ctx.ellipse(
        0,
        0,
        17,
        13,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // --------------------------------------
    // WING
    // --------------------------------------

    ctx.fillStyle =
        "#f5bd25";


    ctx.beginPath();


    ctx.ellipse(
        -5,
        6,
        10,
        6,
        -0.3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // --------------------------------------
    // EYE
    // --------------------------------------

    ctx.fillStyle =
        "white";


    ctx.beginPath();


    ctx.arc(
        8,
        -6,
        5,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Pupil

    ctx.fillStyle =
        "#222";


    ctx.beginPath();


    ctx.arc(
        9,
        -6,
        2,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // --------------------------------------
    // BEAK
    // --------------------------------------

    ctx.fillStyle =
        "#ff8c42";


    ctx.beginPath();


    ctx.moveTo(
        15,
        0
    );


    ctx.lineTo(
        29,
        5
    );


    ctx.lineTo(
        15,
        8
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();

}


// ==========================================
// UPDATE BEST SCORE
// ==========================================

function updateBestScore() {

    if (
        score >
        bestScore
    ) {

        bestScore =
            score;


        localStorage.setItem(
            "flappyBest",
            bestScore
        );


        bestElement.textContent =
            bestScore;

    }

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    finalScoreElement.textContent =
        score;


    gameOverElement.classList.add(
        "show"
    );

}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    update();

    draw();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ==========================================
// KEYBOARD CONTROL
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                startGame();

            }

            else {

                flap();

            }

        }

    }
);


// ==========================================
// MOUSE CONTROL
// ==========================================

canvas.addEventListener(
    "mousedown",
    function() {

        if (gameRunning) {

            flap();

        }

    }
);


// ==========================================
// TOUCH CONTROL
// ==========================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        if (gameRunning) {

            flap();

        }

    },
    {
        passive: false
    }
);


// ==========================================
// START BUTTON
// ==========================================

startButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


// ==========================================
// RESTART BUTTON
// ==========================================

restartButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


// ==========================================
// NEW GAME BUTTON
// ==========================================

newGameButton.addEventListener(
    "click",
    function() {

        startGame();

    }
);


// ==========================================
// INITIALIZE
// ==========================================

resetGame();

draw();;