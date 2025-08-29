// ==============================
// Game state variables
// ==============================
let towers;
let totalDisks;
let moveCounter;
let timeLeft;
let timerInterval;
let timerStarted;

// ==============================
// Public initializer (exported)
// ==============================
export function initTower() {
    // Buttons to switch views
    document.getElementById("startBtn").addEventListener("click", () => {
        showGame();
        setupGame();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        // 👉 Aquí rediriges a donde quieras (otra vista o módulo)
        window.location.href = "/next.html";
    });
}

// ==============================
// Show / Hide views
// ==============================
function showGame() {
    document.getElementById("instructions").hidden = true;
    document.getElementById("game").hidden = false;
}

function showResult(summary) {
    document.getElementById("game").hidden = true;
    document.getElementById("result").hidden = false;
    document.getElementById("gameSummary").innerHTML = summary;
}

// ==============================
// Setup game
// ==============================
function setupGame() {
    towers = { "a": ["disk_1", "disk_2", "disk_3", "disk_4", "disk_5", "disk_6", "disk_7"] };
    totalDisks = 7;
    moveCounter = 0;
    timeLeft = 10;
    timerInterval = null;
    timerStarted = false;

    // Render initial tower and set events
    render("a");
    initGame();

    // Reset UI counters
    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("inC").innerText = 0;
}

// ==============================
// Drag and Drop
// ==============================
function initGame() {
    const disks = document.querySelectorAll("div#container > div > div");
    const dropZones = document.querySelectorAll("div#container > div");

    // Drag handlers
    disks.forEach(disk => {
        disk.addEventListener("dragstart", dragStart, false);
        disk.addEventListener("dragend", dragEnd, false);
    });

    // Drop handlers
    dropZones.forEach(zone => {
        zone.addEventListener("dragenter", e => e.preventDefault(), false);
        zone.addEventListener("dragover", e => e.preventDefault(), false);
        zone.addEventListener("drop", dropHandler, false);
    });
}

function dragStart(e) {
    const parent = e.target.parentNode;
    if (parent.childNodes[0].id === e.target.id) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("Text", e.target.id);
        e.target.classList.add('shaking');
    }
}

function dragEnd(e) {
    e.preventDefault();
    const finalTower = document.getElementById("c");
    e.target.classList.remove('shaking');

    if (finalTower.childNodes.length === totalDisks) {
        clearInterval(timerInterval);

        // Generate final summary
        const gameData = exportGameData();
        localStorage.setItem("towerGameData", JSON.stringify(gameData));

        let summary = `
            ✅ Juego completado <br>
            Movimientos: ${gameData.moves} <br>
            Tiempo usado: ${gameData.timeUsed}s <br>
            <br>
            Torres finales: <br>
            A: [${getDisksInTower("a").join(", ")}] <br>
            B: [${getDisksInTower("b").join(", ")}] <br>
            C: [${getDisksInTower("c").join(", ")}]
        `;

        showResult(summary);
    }
}

function dropHandler(e) {
    e.preventDefault();
    let target = e.target;

    if (!["a", "b", "c"].includes(target.id)) {
        target = target.parentNode;
    }

    const children = target.childNodes;
    const draggedDisk = e.dataTransfer.getData("Text");

    const canDrop = canPlace(children, draggedDisk);

    if (["a", "b", "c"].includes(target.id) && draggedDisk !== "" && canDrop) {
        const diskToMove = document.getElementById(draggedDisk);
        diskToMove.parentNode.removeChild(diskToMove);
        target.innerHTML =
            '<div class="disk" id="' +
            draggedDisk +
            '" draggable="true"></div>' +
            target.innerHTML;

        moveCounter++;

        if (!timerStarted) {
            timerStarted = true;
            startTimer();
        }
    }

    document.getElementById("moves").innerText = moveCounter;
    document.getElementById("inC").innerText = document.getElementById("c").childNodes.length;

    initGame();
}

// ==============================
// Render disks
// ==============================
function render(tower) {
    const container = document.getElementById(tower);
    container.innerHTML = "";
    for (let i = 0; i < towers[tower].length; i++) {
        container.innerHTML +=
            '<div class="disk" id="' +
            towers[tower][i] +
            '" draggable="true"></div>';
    }
}

// ==============================
// Helpers
// ==============================
function canPlace(existing, newDisk) {
    if (existing[0] == undefined) {
        return true;
    } else {
        return newDisk.split("_")[1] < existing[0].id.split("_")[1];
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            goToGameOver();
        }
    }, 1000);
}

function getDisksInTower(towerId) {
    const tower = document.getElementById(towerId);
    return Array.from(tower.childNodes).map(d => d.id);
}

function exportGameData() {
    return {
        totalDisks: totalDisks,
        moves: moveCounter,
        disksInA: getDisksInTower("a"),
        disksInB: getDisksInTower("b"),
        disksInC: getDisksInTower("c"),
        timeUsed: 480 - timeLeft
    };
}




// ==============================
// End game
// ==============================
function goToGameOver() {
    const gameData = exportGameData();
    localStorage.setItem("towerGameData", JSON.stringify(gameData));

    let summary = `
        ⏳ Tiempo agotado <br>
        Movimientos: ${gameData.moves} <br>
        <br>
        Torres finales: <br>
        A: [${gameData.disksInA.join(", ")}] <br>
        B: [${gameData.disksInB.join(", ")}] <br>
        C: [${gameData.disksInC.join(", ")}]
    `;

    showResult(summary);
}

