
const initialState = [1, 2, 3, 4, 0, 6, 7, 5, 8];
const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

let currentState = [...initialState];
let solutionPath = [];
let solutionIndex = 0;
let searchTimer = null;
let animationTimer = null;
let pausedMode = null;
let searchTrace = [];
let traceIndex = 0;

const puzzleBoard = document.getElementById("puzzle-board");
const goalBoard = document.getElementById("goal-board");
const statusElement = document.getElementById("status");

function renderBoard(state, boardElement) {
    boardElement.innerHTML = "";

    state.forEach(value => {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        if (value === 0) {
            tile.classList.add("empty");
        } else {
            tile.textContent = value;
        }

        boardElement.appendChild(tile);
    });
}

function renderPuzzle() {
    renderBoard(currentState, puzzleBoard);
    renderBoard(goalState, goalBoard);
}

function getNeighbors(state, emptyIndex) {
    const neighbors = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    if (row > 0) neighbors.push(emptyIndex - 3);
    if (row < 2) neighbors.push(emptyIndex + 3);
    if (col > 0) neighbors.push(emptyIndex - 1);
    if (col < 2) neighbors.push(emptyIndex + 1);

    return neighbors;
}

function getSuccessors(state) {
    const emptyIndex = state.indexOf(0);

    return getNeighbors(state, emptyIndex).map(index => {
        const nextState = [...state];

        [nextState[emptyIndex], nextState[index]] =
            [nextState[index], nextState[emptyIndex]];

        return nextState;
    });
}

function stateKey(state) {
    return state.join(",");
}

function calculateHeuristic(state, goal, method = "misplaced") {
    if (method === "manhattan") {
        let distance = 0;

        for (let i = 0; i < state.length; i++) {
            const value = state[i];
            if (value === 0) continue;

            const goalIndex = goal.indexOf(value);

            distance +=
                Math.abs(Math.floor(i / 3) - Math.floor(goalIndex / 3)) +
                Math.abs((i % 3) - (goalIndex % 3));
        }

        return distance;
    }

    let misplaced = 0;

    for (let i = 0; i < state.length; i++) {
        if (state[i] !== 0 && state[i] !== goal[i]) {
            misplaced++;
        }
    }

    return misplaced;
}

function getSelectedHeuristic() {
    const selector = document.getElementById("heuristic");
    return selector ? selector.value : "misplaced";
}

function updateHeuristicHeading() {
    const method = getSelectedHeuristic();
    const heading = document.getElementById("heuristic-heading");

    if (heading) {
        heading.textContent =
            method === "manhattan"
                ? "Heuristic: Manhattan Distance"
                : "Heuristic: Misplaced Tiles";
    }
}

document.getElementById("heuristic")?.addEventListener(
    "change",
    updateHeuristicHeading
);

function updatePlaybackButtons() {
    const pauseButton = document.getElementById("pause-btn");
    const resumeButton = document.getElementById("resume-btn");
    const previousButton = document.getElementById("previous-btn");

    const isPlaying =
        searchTimer !== null || animationTimer !== null;

    if (pauseButton) pauseButton.disabled = !isPlaying;
    if (resumeButton) resumeButton.disabled = !pausedMode;

    if (previousButton) {
        previousButton.disabled =
            solutionPath.length === 0 || solutionIndex <= 0;
    }
}

function stopTimers() {
    if (searchTimer !== null) {
        clearInterval(searchTimer);
        searchTimer = null;
    }

    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

    pausedMode = null;
    updatePlaybackButtons();
}

function getAnimationDelay() {
    const control = document.getElementById("speed-control");
    return control ? Number(control.value) || 700 : 700;
}

function resetSearchDisplay() {
    document.getElementById("current-node").textContent = "Not started";
    document.getElementById("current-heuristic").textContent = "-";
    document.getElementById("current-depth").textContent = "-";
    document.getElementById("current-parent").textContent = "-";
    document.getElementById("frontier-list").textContent =
        "Waiting for search...";
    document.getElementById("successor-list").textContent =
        "Waiting for search...";
    document.getElementById("explored-list").textContent =
        "Waiting for search...";
    document.getElementById("progress-log").innerHTML =
        "<p>Search steps will appear here.</p>";
}

function greedyBestFirstSearch(start, goal) {
    const method = getSelectedHeuristic();

    const frontier = [{
        state: [...start],
        depth: 0
    }];

    const explored = new Set();
    const discovered = new Set([stateKey(start)]);
    const parent = new Map();
    const trace = [];

    let generated = 1;
    let expanded = 0;
    let maxDepth = 0;

    while (frontier.length > 0) {
        frontier.sort((a, b) =>
            calculateHeuristic(a.state, goal, method) -
            calculateHeuristic(b.state, goal, method)
        );

        const current = frontier.shift();
        const currentKey = stateKey(current.state);

        if (explored.has(currentKey)) continue;

        explored.add(currentKey);
        expanded++;
        maxDepth = Math.max(maxDepth, current.depth);

        if (currentKey !== stateKey(goal)) {
            for (const nextState of getSuccessors(current.state)) {
                const nextKey = stateKey(nextState);

                if (
                    !explored.has(nextKey) &&
                    !discovered.has(nextKey)
                ) {
                    discovered.add(nextKey);
                    parent.set(nextKey, currentKey);

                    frontier.push({
                        state: nextState,
                        depth: current.depth + 1
                    });

                    generated++;
                }
            }
        }

        trace.push({
            state: [...current.state],
            successors: getSuccessors(current.state).map(
                state => [...state]
            ),
            heuristic: calculateHeuristic(current.state, goal, method),
            depth: current.depth,
            parent: parent.get(currentKey) || "Start",
            frontier: frontier.map(node => ({
                state: [...node.state],
                heuristic: calculateHeuristic(node.state, goal, method),
                depth: node.depth
            })),
            explored: [...explored],
            generated,
            expanded
        });

        if (currentKey === stateKey(goal)) {
            const path = [];
            let key = currentKey;

            while (key !== undefined) {
                path.push(key.split(",").map(Number));
                key = parent.get(key);
            }

            path.reverse();

            return {
                path,
                generated,
                expanded,
                maxDepth,
                trace
            };
        }
    }

    return {
        path: [],
        generated,
        expanded,
        maxDepth,
        trace
    };
}

function displaySearchTraceStep(step, index, total) {
    document.getElementById("current-node").textContent =
        step.state.join(" ");

    document.getElementById("current-heuristic").textContent =
        step.heuristic;

    document.getElementById("current-depth").textContent =
        step.depth;

    document.getElementById("current-parent").textContent =
        step.parent === "Start"
            ? "Start"
            : step.parent.replaceAll(",", " ");

    const successorList = document.getElementById("successor-list");
    successorList.innerHTML = "";

    step.successors.forEach(state => {
        const entry = document.createElement("div");
        entry.className = "state-entry";
        entry.textContent = state.join(" ");
        successorList.appendChild(entry);
    });

    if (step.successors.length === 0) {
        successorList.textContent = "No successors.";
    }

    const frontierList = document.getElementById("frontier-list");
    frontierList.innerHTML = "";

    step.frontier.forEach(node => {
        const entry = document.createElement("div");
        entry.className = "state-entry";
        entry.textContent =
            `${node.state.join(" ")} | g(n)=${node.depth} | ` +
            `h(n)=${node.heuristic} | f(n)=${node.heuristic}`;
        frontierList.appendChild(entry);
    });

    if (step.frontier.length === 0) {
        frontierList.textContent = "Empty";
    }

    const exploredList = document.getElementById("explored-list");
    exploredList.innerHTML = "";

    step.explored.forEach(key => {
        const entry = document.createElement("div");
        entry.className = "state-entry";
        entry.textContent = key.replaceAll(",", " ");
        exploredList.appendChild(entry);
    });

    document.getElementById("explored-count").textContent =
        step.expanded;

    const log = document.getElementById("progress-log");
    const logEntry = document.createElement("p");

    logEntry.textContent =
        `Expansion ${index + 1}/${total}: ${step.state.join(" ")} | ` +
        `h(n)=${step.heuristic} | depth=${step.depth} | ` +
        `Generated=${step.generated}`;

    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
}

function startSearchTraceTimer() {
    if (!searchTrace.length || searchTimer !== null) return;

    searchTimer = setInterval(() => {
        traceIndex++;

        if (traceIndex >= searchTrace.length) {
            clearInterval(searchTimer);
            searchTimer = null;
            pausedMode = null;

            if (solutionPath.length > 0) {
                statusElement.textContent =
                    `Search complete. Solution found in ${solutionPath.length - 1} moves.`;

                document.getElementById("step-btn").disabled =
                    solutionPath.length <= 1;

                document.getElementById("play-btn").disabled =
                    solutionPath.length <= 1;
            } else {
                statusElement.textContent =
                    "Search complete. No solution found.";
            }

            updatePlaybackButtons();
            return;
        }

        displaySearchTraceStep(
            searchTrace[traceIndex],
            traceIndex,
            searchTrace.length
        );
    }, 350);

    updatePlaybackButtons();
}

function playSearchTrace(trace) {
    if (!trace.length) {
        statusElement.textContent = "No search steps to display.";
        return;
    }

    searchTrace = trace;
    traceIndex = 0;
    pausedMode = null;

    displaySearchTraceStep(
        searchTrace[traceIndex],
        traceIndex,
        searchTrace.length
    );

    startSearchTraceTimer();
}

function pausePlayback() {
    if (searchTimer !== null) {
        clearInterval(searchTimer);
        searchTimer = null;
        pausedMode = "search";
        statusElement.textContent = "Search paused.";
        updatePlaybackButtons();
        return;
    }

    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
        pausedMode = "animation";
        statusElement.textContent = "Solution animation paused.";
        updatePlaybackButtons();
    }
}

function resumePlayback() {
    if (pausedMode === "search") {
        pausedMode = null;
        statusElement.textContent = "Resuming search...";
        startSearchTraceTimer();
    } else if (pausedMode === "animation") {
        pausedMode = null;
        statusElement.textContent = "Resuming solution animation...";
        startAnimationTimer();
    }
}

function startAnimationTimer() {
    if (animationTimer !== null) return;

    if (
        solutionPath.length === 0 ||
        solutionIndex >= solutionPath.length - 1
    ) {
        updatePlaybackButtons();
        return;
    }

    animationTimer = setInterval(() => {
        nextStep();

        if (solutionIndex >= solutionPath.length - 1) {
            clearInterval(animationTimer);
            animationTimer = null;
            pausedMode = null;
            statusElement.textContent = "Goal state reached!";
            updatePlaybackButtons();
        }
    }, getAnimationDelay());

    updatePlaybackButtons();
}

function solvePuzzle() {
    stopTimers();

    solutionPath = [];
    solutionIndex = 0;
    searchTrace = [];
    traceIndex = 0;

    document.getElementById("step-btn").disabled = true;
    document.getElementById("play-btn").disabled = true;
    document.getElementById("moves-count").textContent = "0";
    document.getElementById("explored-count").textContent = "0";
    document.getElementById("path-count").textContent = "0";

    resetSearchDisplay();
    statusElement.textContent = "Running Greedy Best-First Search...";

    const startTime = performance.now();
    const result = greedyBestFirstSearch(currentState, goalState);
    const endTime = performance.now();

    document.getElementById("generated-count").textContent =
        result.generated;

    document.getElementById("time-count").textContent =
        `${(endTime - startTime).toFixed(2)} ms`;

    document.getElementById("result-status").textContent =
        result.path.length > 0 ? "Solution Found" : "No Solution Found";

    document.getElementById("summary-moves").textContent =
        result.path.length > 0 ? result.path.length - 1 : 0;

    document.getElementById("summary-generated").textContent =
        result.generated;

    document.getElementById("summary-expanded").textContent =
        result.expanded;

    document.getElementById("summary-depth").textContent =
        result.maxDepth;

    document.getElementById("summary-cost").textContent =
        result.path.length > 0 ? result.path.length - 1 : "N/A";

    const approximateMemoryKB = (result.generated * 100) / 1024;

    document.getElementById("summary-memory").textContent =
        `${approximateMemoryKB.toFixed(2)} KB`;

    solutionPath = result.path;
    searchTrace = result.trace;

    document.getElementById("moves-count").textContent =
        solutionPath.length > 0 ? solutionPath.length - 1 : 0;

    document.getElementById("path-count").textContent =
        solutionPath.length > 0 ? solutionPath.length - 1 : 0;

    const log = document.getElementById("progress-log");
    const summary = document.createElement("p");

    summary.textContent =
        `Search summary: ${result.generated} generated, ` +
        `${result.expanded} expanded, maximum depth ${result.maxDepth}.`;

    log.appendChild(summary);

    if (searchTrace.length > 0) {
        statusElement.textContent = "Showing search progress...";
        playSearchTrace(searchTrace);
    } else {
        statusElement.textContent = "No solution found.";
    }

    updatePlaybackButtons();
}

function nextStep() {
    if (solutionPath.length === 0) return;

    if (solutionIndex >= solutionPath.length - 1) {
        statusElement.textContent = "Goal state reached!";
        document.getElementById("step-btn").disabled = true;
        updatePlaybackButtons();
        return;
    }

    solutionIndex++;
    currentState = [...solutionPath[solutionIndex]];
    renderPuzzle();

    document.getElementById("moves-count").textContent = solutionIndex;

    statusElement.textContent =
        `Solution step ${solutionIndex} of ${solutionPath.length - 1}`;

    const logEntry = document.createElement("p");
    logEntry.textContent =
        `Solution step ${solutionIndex}: ${currentState.join(" ")}`;

    const log = document.getElementById("progress-log");
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;

    if (solutionIndex === solutionPath.length - 1) {
        statusElement.textContent = "Goal state reached!";
        document.getElementById("step-btn").disabled = true;
    }

    updatePlaybackButtons();
}

function previousStep() {
    if (solutionIndex <= 0 || solutionPath.length === 0) return;

    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

    pausedMode = null;
    solutionIndex--;
    currentState = [...solutionPath[solutionIndex]];
    renderPuzzle();

    document.getElementById("moves-count").textContent = solutionIndex;
    document.getElementById("step-btn").disabled = false;
    document.getElementById("play-btn").disabled = false;

    statusElement.textContent =
        solutionIndex === 0
            ? "Returned to the initial puzzle state."
            : `Solution step ${solutionIndex} of ${solutionPath.length - 1}`;

    updatePlaybackButtons();
}

function playAnimation() {
    if (searchTimer !== null) return;

    if (solutionPath.length === 0) {
        solvePuzzle();
        return;
    }

    if (solutionIndex >= solutionPath.length - 1) {
        statusElement.textContent =
            "Already at the goal. Shuffle or reset to try again.";
        return;
    }

    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

    pausedMode = null;
    document.getElementById("play-btn").disabled = true;
    document.getElementById("step-btn").disabled = true;

    startAnimationTimer();
}

function clearSearchResults() {
    stopTimers();

    solutionPath = [];
    solutionIndex = 0;
    searchTrace = [];
    traceIndex = 0;

    document.getElementById("moves-count").textContent = "0";
    document.getElementById("explored-count").textContent = "0";
    document.getElementById("path-count").textContent = "0";
    document.getElementById("generated-count").textContent = "0";
    document.getElementById("time-count").textContent = "0 ms";
    document.getElementById("result-status").textContent = "Not started";
    document.getElementById("summary-moves").textContent = "0";
    document.getElementById("summary-generated").textContent = "0";
    document.getElementById("summary-expanded").textContent = "0";
    document.getElementById("summary-depth").textContent = "0";
    document.getElementById("summary-cost").textContent = "0";
    document.getElementById("summary-memory").textContent = "0 KB";

    document.getElementById("step-btn").disabled = true;
    document.getElementById("play-btn").disabled = true;

    resetSearchDisplay();
    updatePlaybackButtons();
}

function shufflePuzzle() {
    currentState = [...goalState];

    for (let i = 0; i < 30; i++) {
        const emptyIndex = currentState.indexOf(0);
        const possibleMoves = getNeighbors(currentState, emptyIndex);
        const randomIndex = Math.floor(
            Math.random() * possibleMoves.length
        );

        const nextIndex = possibleMoves[randomIndex];

        [currentState[emptyIndex], currentState[nextIndex]] =
            [currentState[nextIndex], currentState[emptyIndex]];
    }

    renderPuzzle();
    document.getElementById("initial-state-input").value =
        currentState.join(" ");
    clearSearchResults();
    statusElement.textContent = "Puzzle shuffled. Ready to solve.";
}

document.getElementById("shuffle-btn").addEventListener(
    "click",
    shufflePuzzle
);
document.getElementById("reset-btn").addEventListener("click", () => {
    currentState = [...initialState];
    renderPuzzle();
    clearSearchResults();
    statusElement.textContent = "Puzzle reset to its initial state.";
});

document.getElementById("solve-btn").addEventListener(
    "click",
    solvePuzzle
);

document.getElementById("step-btn").addEventListener(
    "click",
    nextStep
);

document.getElementById("play-btn").addEventListener(
    "click",
    playAnimation
);

document.getElementById("pause-btn")?.addEventListener(
    "click",
    pausePlayback
);

document.getElementById("resume-btn")?.addEventListener(
    "click",
    resumePlayback
);

document.getElementById("previous-btn")?.addEventListener(
    "click",
    previousStep
);

document.getElementById("speed-control")?.addEventListener("change", () => {
    if (animationTimer !== null) {
        clearInterval(animationTimer);
        animationTimer = null;
        startAnimationTimer();
    }
});
function parsePuzzleInput(inputId) {
    const input = document.getElementById(inputId);
    const values = input.value.trim().split(/\s+/).map(Number);

    if (
        values.length !== 9 ||
        values.some(value => !Number.isInteger(value) || value < 0 || value > 8) ||
        new Set(values).size !== 9
    ) {
        alert("Enter each number from 0 to 8 exactly once, separated by spaces.");
        return null;
    }

    return values;
}

function isSolvableToGoal(start, goal) {
    function getInversions(state) {
        const tiles = state.filter(value => value !== 0);
        let inversions = 0;

        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i] > tiles[j]) {
                    inversions++;
                }
            }
        }

        return inversions;
    }

    return getInversions(start) % 2 === getInversions(goal) % 2;
}

document.getElementById("apply-initial-btn").addEventListener("click", () => {
    const state = parsePuzzleInput("initial-state-input");
    if (!state) return;

    if (!isSolvableToGoal(state, goalState)) {
        alert("This initial state cannot reach the current goal state. Try another arrangement.");
        return;
    }

    stopTimers();
    initialState.splice(0, initialState.length, ...state);
    currentState = [...state];

    renderPuzzle();
    clearSearchResults();
    statusElement.textContent = "Custom initial state applied. Ready to solve.";
});

document.getElementById("apply-goal-btn").addEventListener("click", () => {
    const state = parsePuzzleInput("goal-state-input");
    if (!state) return;

    if (!isSolvableToGoal(currentState, state)) {
        alert("This goal state cannot be reached from the current puzzle. Try another arrangement.");
        return;
    }

    stopTimers();
    goalState.splice(0, goalState.length, ...state);

    renderPuzzle();
    clearSearchResults();
    statusElement.textContent = "Custom goal state applied. Ready to solve.";
});
updatePlaybackButtons();
renderPuzzle();
