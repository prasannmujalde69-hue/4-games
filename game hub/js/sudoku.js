// ==========================================
// SUDOKU GAME
// ==========================================

const boardElement =
    document.getElementById("sudokuBoard");

const timerElement =
    document.getElementById("timer");

const mistakesElement =
    document.getElementById("mistakes");

const newGameButton =
    document.getElementById("newGame");

const messageElement =
    document.getElementById("message");


// ==========================================
// VARIABLES
// ==========================================

let solution = [];

let puzzle = [];

let selectedCell = null;

let mistakes = 0;

let seconds = 0;

let timerInterval = null;

let gameOver = false;

const MAX_MISTAKES = 3;


// ==========================================
// START GAME
// ==========================================

function startGame() {

    clearInterval(timerInterval);

    mistakes = 0;

    seconds = 0;

    gameOver = false;

    selectedCell = null;

    messageElement.textContent = "";

    mistakesElement.textContent = "0/3";

    timerElement.textContent = "00:00";


    solution = createSolvedBoard();

    puzzle = createPuzzle(
        solution,
        45
    );


    createBoard();

    startTimer();

}


// ==========================================
// CREATE SOLVED BOARD
// ==========================================

function createSolvedBoard() {

    const board = Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );


    fillBoard(board);

    return board;

}


// ==========================================
// FILL BOARD
// ==========================================

function fillBoard(board) {

    const empty = findEmptyCell(board);

    if (!empty) {
        return true;
    }


    const row = empty.row;

    const col = empty.col;


    const numbers =
        shuffledNumbers();


    for (const number of numbers) {

        if (
            isValid(
                board,
                row,
                col,
                number
            )
        ) {

            board[row][col] = number;


            if (fillBoard(board)) {
                return true;
            }


            board[row][col] = 0;

        }

    }


    return false;

}


// ==========================================
// FIND EMPTY CELL
// ==========================================

function findEmptyCell(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                return {
                    row,
                    col
                };

            }

        }

    }


    return null;

}


// ==========================================
// SHUFFLED NUMBERS
// ==========================================

function shuffledNumbers() {

    const numbers =
        [1, 2, 3, 4, 5, 6, 7, 8, 9];


    for (
        let i = numbers.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            numbers[i],
            numbers[j]
        ] =
        [
            numbers[j],
            numbers[i]
        ];

    }


    return numbers;

}


// ==========================================
// VALID NUMBER
// ==========================================

function isValid(
    board,
    row,
    col,
    number
) {

    // Row

    for (let x = 0; x < 9; x++) {

        if (
            board[row][x] === number
        ) {

            return false;

        }

    }


    // Column

    for (let x = 0; x < 9; x++) {

        if (
            board[x][col] === number
        ) {

            return false;

        }

    }


    // 3x3 box

    const boxRow =
        Math.floor(row / 3) * 3;

    const boxCol =
        Math.floor(col / 3) * 3;


    for (let r = 0; r < 3; r++) {

        for (let c = 0; c < 3; c++) {

            if (
                board[
                    boxRow + r
                ][
                    boxCol + c
                ] === number
            ) {

                return false;

            }

        }

    }


    return true;

}


// ==========================================
// CREATE PUZZLE
// ==========================================

function createPuzzle(
    solvedBoard,
    removeCount
) {

    const puzzle =
        solvedBoard.map(
            row => [...row]
        );


    let removed = 0;


    while (
        removed < removeCount
    ) {

        const row =
            Math.floor(
                Math.random() * 9
            );

        const col =
            Math.floor(
                Math.random() * 9
            );


        if (
            puzzle[row][col] !== 0
        ) {

            puzzle[row][col] = 0;

            removed++;

        }

    }


    return puzzle;

}


// ==========================================
// CREATE HTML BOARD
// ==========================================

function createBoard() {

    boardElement.innerHTML = "";


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell =
                document.createElement("div");


            cell.classList.add("cell");


            const value =
                puzzle[row][col];


            if (value !== 0) {

                cell.textContent = value;

                cell.classList.add(
                    "given"
                );

            }


            cell.dataset.row = row;

            cell.dataset.col = col;


            cell.addEventListener(
                "click",
                () => {

                    selectCell(
                        row,
                        col
                    );

                }
            );


            boardElement.appendChild(
                cell
            );

        }

    }

}


// ==========================================
// SELECT CELL
// ==========================================

function selectCell(row, col) {

    // Don't allow selection after game over

    if (gameOver) {
        return;
    }


    // Don't select original numbers

    if (
        puzzle[row][col] !== 0
    ) {

        return;

    }


    selectedCell = {
        row,
        col
    };


    updateHighlights();

}


// ==========================================
// HIGHLIGHTS
// ==========================================

function updateHighlights() {

    const cells =
        boardElement.querySelectorAll(
            ".cell"
        );


    cells.forEach(cell => {

        cell.classList.remove(
            "selected",
            "highlight"
        );

    });


    if (!selectedCell) {
        return;
    }


    const {
        row,
        col
    } = selectedCell;


    cells.forEach(cell => {

        const cellRow =
            Number(cell.dataset.row);

        const cellCol =
            Number(cell.dataset.col);


        if (
            cellRow === row ||
            cellCol === col ||
            (
                Math.floor(
                    cellRow / 3
                ) === Math.floor(
                    row / 3
                ) &&
                Math.floor(
                    cellCol / 3
                ) === Math.floor(
                    col / 3
                )
            )
        ) {

            cell.classList.add(
                "highlight"
            );

        }

    });


    const selected =
        getCell(row, col);


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }

}


// ==========================================
// GET CELL
// ==========================================

function getCell(row, col) {

    return boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );

}


// ==========================================
// ENTER NUMBER
// ==========================================

function enterNumber(number) {

    // Stop game after Game Over

    if (gameOver) {
        return;
    }


    if (!selectedCell) {

        messageElement.textContent =
            "Select an empty cell first.";

        return;

    }


    const row =
        selectedCell.row;

    const col =
        selectedCell.col;


    // Don't change filled cells

    if (
        puzzle[row][col] !== 0
    ) {

        return;

    }


    const cell =
        getCell(row, col);


    // ==========================================
    // CORRECT NUMBER
    // ==========================================

    if (
        number === solution[row][col]
    ) {

        cell.textContent = number;

        cell.classList.add(
            "user-number"
        );

        puzzle[row][col] = number;

        messageElement.textContent = "";

        updateHighlights();

        checkWin();

    }


    // ==========================================
    // WRONG NUMBER
    // ==========================================

    else {

        mistakes++;

        mistakesElement.textContent =
            `${mistakes}/3`;

        cell.classList.add(
            "wrong"
        );

        messageElement.textContent =
            "That's not the correct number.";


        setTimeout(() => {

            cell.classList.remove(
                "wrong"
            );

        }, 450);


        // Game Over after 3 mistakes

        if (
            mistakes >= MAX_MISTAKES
        ) {

            endGame();

        }

    }

}


// ==========================================
// ERASE NUMBER
// ==========================================

function eraseNumber() {

    // Stop game after Game Over

    if (gameOver) {
        return;
    }


    if (!selectedCell) {
        return;
    }


    const row =
        selectedCell.row;

    const col =
        selectedCell.col;


    const cell =
        getCell(row, col);


    // Don't erase original puzzle numbers

    if (
        cell.classList.contains("given")
    ) {

        return;

    }


    // Only erase player's numbers

    if (
        cell.classList.contains(
            "user-number"
        )
    ) {

        puzzle[row][col] = 0;

        cell.textContent = "";

        cell.classList.remove(
            "user-number"
        );

        messageElement.textContent = "";

        updateHighlights();

    }

}


// ==========================================
// CHECK WIN
// ==========================================

function checkWin() {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (
                puzzle[row][col] !==
                solution[row][col]
            ) {

                return;

            }

        }

    }


    // Stop the game

    gameOver = true;

    clearInterval(timerInterval);

    messageElement.textContent =
        `🎉 You solved it in ${formatTime(seconds)}!`;

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameOver = true;

    clearInterval(timerInterval);

    selectedCell = null;

    updateHighlights();

    messageElement.textContent =
        "❌ Game Over! You made 3 mistakes.";

}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    timerInterval =
        setInterval(() => {

            // Don't continue after game over

            if (gameOver) {
                return;
            }


            seconds++;

            timerElement.textContent =
                formatTime(seconds);

        }, 1000);

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const remainingSeconds =
        totalSeconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(
            2,
            "0"
        )
    );

}


// ==========================================
// NUMBER PAD
// ==========================================

const numberButtons =
    document.querySelectorAll(
        ".number-pad button"
    );


numberButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const number =
                Number(
                    button.dataset.number
                );


            if (number === 0) {

                eraseNumber();

            }

            else {

                enterNumber(number);

            }

        }
    );

});


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        // Ignore keyboard input after Game Over

        if (gameOver) {
            return;
        }


        if (
            event.key >= "1" &&
            event.key <= "9"
        ) {

            enterNumber(
                Number(event.key)
            );

        }


        if (
            event.key === "Backspace" ||
            event.key === "Delete" ||
            event.key === "0"
        ) {

            eraseNumber();

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
// START
// ==========================================

startGame();