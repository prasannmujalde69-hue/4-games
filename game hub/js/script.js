// ==============================
// GAME BUTTON
// ==============================

function openGame(gameName) {

    alert(
        gameName +
        " is coming soon! We will build this game next."
    );

}


// ==============================
// DARK / LIGHT MODE
// ==============================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }

});