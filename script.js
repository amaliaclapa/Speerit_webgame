document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const svg = document.getElementById('lines');

    if (!svg) {
        console.error("Elementul SVG 'lines' nu a fost găsit în DOM.");
        return;
    }
    if (cells.length === 0) {
        console.error("Nu există elemente cu clasa 'cell' în DOM.");
        return;
    }

    const getLineCoordinates = (index1, index2) => {
        if (!cells[index1] || !cells[index2]) return null;

        const rect1 = cells[index1].getBoundingClientRect();
        const rect2 = cells[index2].getBoundingClientRect();

        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        return {
            x1: rect1.left + rect1.width / 2 + scrollX,
            y1: rect1.top + rect1.height / 2 + scrollY,
            x2: rect2.left + rect2.width / 2 + scrollX,
            y2: rect2.top + rect2.height / 2 + scrollY
        };
    };

    const createLine = (x1, y1, x2, y2) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.classList.add('line');
        return line;
    };

    const drawLines = () => {
        if (!svg) return;
        svg.innerHTML = '';

        const coordinates = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
            [6, 13], [13, 12], [12, 11], [11, 10], [10, 9], [9, 8], [8, 7],
            [7, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
            [20, 27], [27, 26], [26, 25], [25, 24], [24, 23], [23, 22], [22, 21],
            [21, 28]
        ];

        coordinates.forEach(([start, end]) => {
            const coords = getLineCoordinates(start, end);
            if (coords) {
                const line = createLine(coords.x1, coords.y1, coords.x2, coords.y2);
                svg.appendChild(line);
            }
        });
    };

    drawLines();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestAnimationFrame(drawLines);
        }, 100);
    });
});
const questions = [
        "The therapist friend", "Social awkwardness", "(Destructive) coping mechanisms",
        "Crippling anxiety", "Pressure to vape", "School counseling", "Intrusive thoughts",
        "(First-rate/top) student", "(Practicing) vulnerability", "Controversial tweet",
        "(Committed) to self growth", "Growth", "Drama queen", "Group chit-chat",
        "Gossiping", "Reduced self-confidence", "(Feeling) worn out", "Confident outfit",
        "Technology addiction", "Clever/healthy habits", "(Engaging) in vandalism",
        "Pushy parents"
    ];

    const questions2 = [
        "Celebrity endorsement", "Depraved friend group", "Nerve-wracking boyfriend",
        "Waking up wonderstruck/excited", "Therapist hotline", "Agoraphobia",
        "Nicotine addiction"
    ];


const players = []; 
let currentPlayerIndex = 0;


function createDice(number) {
    const dotPositionMatrix = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [25, 75], [75, 25], [75, 75]],
        5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
        6: [[25, 25], [25, 75], [50, 25], [50, 75], [75, 25], [75, 75]]
    };

    const dice = document.createElement("div");
    dice.classList.add("dice");

    for (const dotPosition of dotPositionMatrix[number]) {
        const dot = document.createElement("div");
        dot.classList.add("dice-dot");
        dot.style.setProperty("--top", dotPosition[0] + "%");
        dot.style.setProperty("--left", dotPosition[1] + "%");
        dice.appendChild(dot);
    }

    return dice;
}

function randomizeDice(diceContainer) {
    diceContainer.innerHTML = "";
    const random = Math.floor((Math.random() * 6) + 1);
    const dice = createDice(random);
    diceContainer.appendChild(dice);
}
const diceContainer = document.getElementById("diceContainer");

function showDice(value) {
    diceContainer.innerHTML = "";
    const dice = createDice(value);
    diceContainer.appendChild(dice);
}

document.addEventListener("DOMContentLoaded", () => {
    showDice(1); 
});


diceContainer.addEventListener("click", () => {
    updateActivePlayerHighlight();

    const rollDuration = 1000;

    const interval = setInterval(() => {
        const rand = Math.floor(Math.random() * 6) + 1;
        showDice(rand);
    }, 70);

    setTimeout(() => {
        clearInterval(interval);

        const finalValue = Math.floor(Math.random() * 6) + 1;
        showDice(finalValue);

        if (players.length > 0) {
            moveCurrentPlayer(finalValue);
        }
    }, rollDuration);
});




function forceRedrawBeforeMove() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    });
}

function updateActivePlayerHighlight() {
    const allSquares = document.querySelectorAll('.left-panel .square');
    allSquares.forEach(sq => sq.classList.remove('active-turn'));

    const currentSquare = allSquares[currentPlayerIndex];
    if (currentSquare) {
        currentSquare.classList.add('active-turn');
    }
}

function animateStepBackward(position, destination, callback) {
    if (position <= destination) {
        callback();
        return;
    }

    const gameBoard = document.querySelector(".game-board");
    const cell = document.querySelector(`[data-id="${position - 1}"]`);
    if (!cell) {
        callback();
        return;
    }

    const boardRect = gameBoard.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    const playerObj = players[currentPlayerIndex];

    const offsetX = cellRect.left - boardRect.left + (cellRect.width / 2) - (playerObj.element.offsetWidth / 2);
    const offsetY = cellRect.top - boardRect.top + (cellRect.height / 2) - (playerObj.element.offsetHeight / 2);

    playerObj.element.style.transition = "all 0.2s ease";
    playerObj.element.style.left = `${offsetX}px`;
    playerObj.element.style.top = `${offsetY}px`;

    setTimeout(() => {
        animateStepBackward(position - 1, destination, callback);
    }, 250);
}


function moveCurrentPlayer(diceValue) {
    const playerObj = players[currentPlayerIndex];

    if (playerObj.position > 0) {
        playerObj.startPosition = playerObj.position;
    }

    let current = playerObj.position;
    const maxCell = 28;
    let target = current + diceValue;
    if (target > maxCell) target = maxCell;

    const gameBoard = document.querySelector(".game-board");

    if (current === 0) {
        const startCell = document.querySelector(`[data-id="1"]`);
        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = startCell.getBoundingClientRect();

        const startX = cellRect.left - boardRect.left + (cellRect.width / 2) - (playerObj.element.offsetWidth / 2);
        const startY = cellRect.top - boardRect.top + (cellRect.height / 2) - (playerObj.element.offsetHeight / 2);

        playerObj.element.style.left = `${startX}px`;
        playerObj.element.style.top = `${startY}px`;
        gameBoard.appendChild(playerObj.element);

        requestAnimationFrame(() => {
            playerObj.element.classList.add("appeared");
        });

        current = 1;
        playerObj.position = 1;
        playerObj.startPosition = playerObj.position;

        target = playerObj.position + diceValue - 1;
        if (target > maxCell) target = maxCell;
    }

    const totalSteps = target - current;

    function animateStep(position, stepIndex, totalSteps, callback) {
        if (stepIndex >= totalSteps) {
            callback();
            return;
        }

        const cell = document.querySelector(`[data-id="${position}"]`);
        if (!cell) return;

        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();

        const offsetX = cellRect.left - boardRect.left + (cellRect.width / 2) - (playerObj.element.offsetWidth / 2);
        const offsetY = cellRect.top - boardRect.top + (cellRect.height / 2) - (playerObj.element.offsetHeight / 2);

        playerObj.element.style.transition = "all 0.2s ease";
        playerObj.element.style.left = `${offsetX}px`;
        playerObj.element.style.top = `${offsetY}px`;

        setTimeout(() => {
            animateStep(position + 1, stepIndex + 1, totalSteps, callback);
        }, 250);
    }

    animateStep(current + 1, 0, totalSteps, () => {
        playerObj.position = target;

        const cellPlayers = players.filter(p => p.position === target);
        const cell = document.querySelector(`[data-id="${target}"]`);
        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        const centerX = cellRect.left - boardRect.left + (cellRect.width / 2);
        const centerY = cellRect.top - boardRect.top + (cellRect.height / 2);
        const total = cellPlayers.length;

        cellPlayers.forEach((p, index) => {
            const dx = (index - (total - 1) / 2) * (p.element.offsetWidth + 5);
            p.element.style.left = `${centerX - p.element.offsetWidth / 2 + dx}px`;
            p.element.style.top = `${centerY - p.element.offsetHeight / 2}px`;
        });

        if (target === maxCell) {
            alert(`Player ${currentPlayerIndex + 1} is the winner!🎉`);
        }
    });
}
function movePlayerBackToStartPosition(player) {
    const start = player.startPosition;
    if (!start || start < 1) {
        console.warn("Poziție inițială invalidă:", start);
        return;
    }

    const cell = document.querySelector(`[data-id="${start}"]`);
    if (!cell) {
        console.warn("Celula nu a fost găsită pentru revenire la poziția:", start);
        return;
    }

    const gameBoard = document.querySelector(".game-board");
    const boardRect = gameBoard.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    const offsetX = cellRect.left - boardRect.left + (cellRect.width / 2) - (player.element.offsetWidth / 2);
    const offsetY = cellRect.top - boardRect.top + (cellRect.height / 2) - (player.element.offsetHeight / 2);

    player.element.style.left = `${offsetX}px`;
    player.element.style.top = `${offsetY}px`;

    player.position = start;
}


document.addEventListener("DOMContentLoaded", () => {
    const diceContainer = document.querySelector(".dice-container");
    const diceValueDisplay = document.getElementById("diceValue");

    const leftSquares = document.querySelectorAll(".left-panel .square");
    const characterItems = document.querySelectorAll(".characterItem");
    const confirmSelectionButton = document.getElementById("confirmSelection");
    const characterBox = document.querySelector(".characterBox");
    const gameBoard = document.querySelector(".game-board");

    let selectedCount = 0;

    characterItems.forEach(item => {
        item.addEventListener("click", function () {
            if (!item.classList.contains("selected") && selectedCount < 3) {
                item.classList.add("selected");
                item.querySelector("img").style.opacity = "0.5";

                const imgSrc = item.querySelector("img").src;
                const emptySquare = Array.from(leftSquares).find(sq => !sq.hasChildNodes());
                if (emptySquare) {
                    emptySquare.innerHTML = `<img src="${imgSrc}" alt="Selected Character">`;
                }

                selectedCount++;

                if (selectedCount === 3) {
                    characterBox.style.pointerEvents = "none";
                }
            }
        });
    });

    confirmSelectionButton.addEventListener("click", function () {
        if (selectedCount < 2) {
            alert("You need at least two characters to start the game");
            return;
        }

        characterBox.style.display = "none";

        const selectedImages = Array.from(leftSquares)
            .filter(square => square.firstChild)
            .map(square => square.firstChild.src);

        const numPlayers = selectedImages.length;
        let size = numPlayers === 1 ? 80 : numPlayers === 2 ? 60 : 50;

        const firstCell = document.querySelector('[data-id="1"]');
        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = firstCell.getBoundingClientRect();
        const centerX = cellRect.left - boardRect.left + (cellRect.width / 2);
        const centerY = cellRect.top - boardRect.top + (cellRect.height / 2);

        document.querySelectorAll(".player").forEach(p => p.remove());
        players.length = 0;

        selectedImages.forEach((src, index) => {
        const player = document.createElement("div");
        player.classList.add("player");
        player.style.width = `${size}px`;
        player.style.height = `${size}px`;

        const img = document.createElement("img");
     img.src = src;
        player.appendChild(img);

        players.push({
        element: player,
        src: src,
        position: 0 
    });
});

    });
});
let isAnswerPanelOpen = false;
document.addEventListener('DOMContentLoaded', () => {
    const yellowClock = document.querySelector('.clock.yellow-clock');
    const purpleClock = document.querySelector('.clock.purple-clock');

    

    

 function showAnswerPanel(question, color) {
    if (isAnswerPanelOpen) return; 

    isAnswerPanelOpen = true;

    const panel = document.createElement('div');
    panel.classList.add('answer-panel', color); 

    const questionText = document.createElement('p');
    questionText.innerText = question;
    panel.appendChild(questionText);

    const textArea = document.createElement('textarea');
    textArea.classList.add('answer-input');
    panel.appendChild(textArea);

    const timerText = document.createElement('p');
    timerText.classList.add('timer');
    panel.appendChild(timerText);

    const submitButton = document.createElement('button');
    submitButton.innerText = "Submit";
    submitButton.classList.add('submit-button');
    panel.appendChild(submitButton);

    document.body.appendChild(panel);

    let timeLeft = 90;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("❗The time is over❗");
            closePanel();
        }
    }, 1000);

    submitButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    const answer = textArea.value;
    closePanel(question, answer, color); 
});

function closePanel(questionText, answer, color) {
    if (panel && panel.parentNode) {
        panel.remove(); 
    }

    isAnswerPanelOpen = false;

    showTeamResponsePanel(questionText, answer, color);
}


}
    yellowClock.addEventListener('click', () => {
        const question = getRandomQuestion(questions2);
        showAnswerPanel(question,"yellow");
    });

    purpleClock.addEventListener('click', () => {
        const question = getRandomQuestion(questions);
        showAnswerPanel(question, "purple");
    });
});
function getRandomQuestion(questionArray) {
        const index = Math.floor(Math.random() * questionArray.length);
        return questionArray[index];
    }
function showTeamResponsePanel(question, playerAnswer, color) {
    const existingPanel = document.querySelector('.team-response-panel');
    if (existingPanel) existingPanel.remove();

    const teamPanel = document.createElement('div'); 
    teamPanel.classList.add('team-response-panel');

    if (color === "yellow") {
        teamPanel.classList.add("yellow");
    } else if (color === "purple") {
        teamPanel.classList.add("purple");
    }

    teamPanel.innerHTML = `
        <div class="team-content">
            <div class="question-block">
                <strong>Player's answer:</strong><br><br>${playerAnswer || "(no answer)"}
            </div>
            <div class="answer-block">
                <label for="teamAnswer">Team's answer:</label>
                <textarea id="teamAnswer" rows="5" cols="30"></textarea><br>
                <span><strong>Time: </strong> <span id="team-timer">90s</span></span><br>
                <button id="submitTeamAnswer">Submit</button>
            </div>
        </div>
    `;

    document.body.appendChild(teamPanel);

    const teamInput = teamPanel.querySelector("#teamAnswer");
    const teamSubmit = teamPanel.querySelector("#submitTeamAnswer");

    let teamTime = 90;
    const timerSpan = teamPanel.querySelector('#team-timer');

    const teamTimer = setInterval(() => {
        teamTime--;
        if (timerSpan) {
            timerSpan.textContent = `${teamTime}s`;
        }

        if (teamTime <= 0) {
            clearInterval(teamTimer);
            alert("❗The time is over❗");

            teamInput.disabled = true;
            teamSubmit.disabled = true;
            document.body.removeChild(teamPanel);
        }
    }, 1000);

    teamSubmit.addEventListener("click", () => {
    clearInterval(teamTimer);
    const teamAnswer = teamInput.value.trim();

    const playerObj = players[currentPlayerIndex];

    if (teamAnswer.toLowerCase() === question.toLowerCase()) {
        alert(`✅Correct answer: ${teamAnswer}`);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } else {
        alert("❌Wrong answer❌");

        animateStepBackward(playerObj.position, playerObj.startPosition, () => {
            playerObj.position = playerObj.startPosition;

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        });
    }

    document.body.removeChild(teamPanel);
});

}