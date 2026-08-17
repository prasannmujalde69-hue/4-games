// ==========================================
// 2048 GAME
// ==========================================

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const newGameButton = document.getElementById("newGame");
const gameOverElement = document.getElementById("gameOver");

let board = [];
let score = 0;

let bestScore =
    Number(localStorage.getItem("2048Best")) || 0;


// ==========================================
// START GAME
// ==========================================

function startGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    gameOverElement.classList.remove("show");

    addRandomTile();
    addRandomTile();

    updateDisplay();
}


// ==========================================
// ADD RANDOM TILE
// ==========================================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });

            }

        }

    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[
            Math.floor(
                Math.random() * emptyCells.length
            )
        ];

    board[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ==========================================
// DISPLAY BOARD
// ==========================================

function updateDisplay() {

    // Remove only old tiles
    const oldTiles =
        boardElement.querySelectorAll(".tile");

    oldTiles.forEach(tile => {
        tile.remove();
    });


    // Create all 16 board positions
    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            const value =
                board[row][col];

            const tile =
                document.createElement("div");

            tile.classList.add("tile");

            // Add empty or number class
            tile.classList.add(
                "tile-" + value
            );

            // Show number only if not empty
            if (value !== 0) {

                tile.textContent = value;

            }

            boardElement.appendChild(tile);

        }

    }


    scoreElement.textContent = score;

    bestElement.textContent = bestScore;
}


// ==========================================
// MOVE LEFT
// ==========================================

function moveLeft() {

    let moved = false;

    for (let row = 0; row < 4; row++) {

        const original =
            [...board[row]];

        let line =
            board[row].filter(
                value => value !== 0
            );


        for (
            let i = 0;
            i < line.length - 1;
            i++
        ) {

            if (
                line[i] ===
                line[i + 1]
            ) {

                line[i] *= 2;

                score += line[i];

                line.splice(
                    i + 1,
                    1
                );

            }

        }


        while (line.length < 4) {

            line.push(0);

        }


        board[row] = line;


        if (
            JSON.stringify(original) !==
            JSON.stringify(line)
        ) {

            moved = true;

        }

    }

    return moved;
}


// ==========================================
// MOVE RIGHT
// ==========================================

function moveRight() {

    reverseBoard();

    const moved =
        moveLeft();

    reverseBoard();

    return moved;
}


// ==========================================
// MOVE UP
// ==========================================

function moveUp() {

    rotateBoard();
    rotateBoard();
    rotateBoard();

    const moved =
        moveLeft();

    rotateBoard();

    return moved;
}


// ==========================================
// MOVE DOWN
// ==========================================

function moveDown() {

    rotateBoard();

    const moved =
        moveLeft();

    rotateBoard();
    rotateBoard();
    rotateBoard();

    return moved;
}


// ==========================================
// REVERSE BOARD
// ==========================================

function reverseBoard() {

    for (let row = 0; row < 4; row++) {

        board[row].reverse();

    }
}


// ==========================================
// ROTATE BOARD
// ==========================================

function rotateBoard() {

    const newBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];


    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            newBoard[col][3 - row] =
                board[row][col];

        }

    }

    board = newBoard;
}


// ==========================================
// MAKE MOVE
// ==========================================

function makeMove(direction) {

    if (
        gameOverElement.classList.contains("show")
    ) {

        return;

    }


    let moved = false;


    if (direction === "left") {

        moved = moveLeft();

    }

    else if (direction === "right") {

        moved = moveRight();

    }

    else if (direction === "up") {

        moved = moveUp();

    }

    else if (direction === "down") {

        moved = moveDown();

    }


    if (moved) {

        addRandomTile();

        updateBestScore();

        updateDisplay();


        if (isGameOver()) {

            gameOverElement.classList.add(
                "show"
            );

        }

    }

}


// ==========================================
// GAME OVER CHECK
// ==========================================

function isGameOver() {

    // Check empty cells

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (
                board[row][col] === 0
            ) {

                return false;

            }

        }

    }


    // Check horizontal merges

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 3; col++) {

            if (
                board[row][col] ===
                board[row][col + 1]
            ) {

                return false;

            }

        }

    }


    // Check vertical merges

    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 4; col++) {

            if (
                board[row][col] ===
                board[row + 1][col]
            ) {

                return false;

            }

        }

    }


    return true;
}


// ==========================================
// BEST SCORE
// ==========================================

function updateBestScore() {

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "2048Best",
            bestScore
        );

    }

}


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        const keys = {

            ArrowLeft: "left",

            ArrowRight: "right",

            ArrowUp: "up",

            ArrowDown: "down"

        };


        if (keys[event.key]) {

            event.preventDefault();

            makeMove(
                keys[event.key]
            );

        }

    }
);


// ==========================================
// NEW GAME
// ==========================================

newGameButton.addEventListener(
    "click",
    startGame
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

            const direction =
                button.dataset.direction;

            makeMove(direction);

        }
    );

});


// ==========================================
// MOBILE SWIPE
// ==========================================

let startX = 0;
let startY = 0;


boardElement.addEventListener(
    "touchstart",
    function(event) {

        startX =
            event.touches[0].clientX;

        startY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


boardElement.addEventListener(
    "touchend",
    function(event) {

        const endX =
            event.changedTouches[0].clientX;

        const endY =
            event.changedTouches[0].clientY;


        const differenceX =
            endX - startX;

        const differenceY =
            endY - startY;


        if (
            Math.abs(differenceX) < 30 &&
            Math.abs(differenceY) < 30
        ) {

            return;

        }


        if (
            Math.abs(differenceX) >
            Math.abs(differenceY)
        ) {

            if (differenceX > 0) {

                makeMove("right");

            }

            else {

                makeMove("left");

            }

        }

        else {

            if (differenceY > 0) {

                makeMove("down");

            }

            else {

                makeMove("up");

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