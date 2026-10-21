
"use strict";

const COMPARISON_NODE_LIMIT = 200000;

function parseComparisonState(value) {
    const parts = value.trim().split(/\s+/);

    if (parts.length !== 9) {
        throw new Error("Enter exactly nine numbers from 0 to 8.");
    }

    const state = parts.map(Number);

    if (
        state.some(n => !Number.isInteger(n) || n < 0 || n > 8) ||
        new Set(state).size !== 9
    ) {
        throw new Error("Each number from 0 to 8 must appear exactly once.");
    }

    return state;
}

function comparisonKey(state) {
    return state.join(",");
}

function comparisonSolvable(start, goal) {
    const goalOrder = new Map();
    let index = 0;

    for (const tile of goal) {
        if (tile !== 0) goalOrder.set(tile, index++);
    }

    const ordered = start
        .filter(tile => tile !== 0)
        .map(tile => goalOrder.get(tile));

    let inversions = 0;

    for (let i = 0; i < ordered.length; i++) {
        for (let j = i + 1; j < ordered.length; j++) {
            if (ordered[i] > ordered[j]) inversions++;
        }
    }

    return inversions % 2 === 0;
}

function comparisonHeuristic(state, goal, type) {
    let score = 0;

    for (let i = 0; i < 9; i++) {
        const tile = state[i];

        if (tile === 0) continue;

        if (type === "misplaced") {
            if (tile !== goal[i]) score++;
        } else {
            const goalIndex = goal.indexOf(tile);

            score +=
                Math.abs(Math.floor(i / 3) - Math.floor(goalIndex / 3)) +
                Math.abs((i % 3) - (goalIndex % 3));
        }
    }

    return score;
}

function comparisonSuccessors(state) {
    const blank = state.indexOf(0);
    const row = Math.floor(blank / 3);
    const col = blank % 3;

    const moves = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    const result = [];

    for (const [dr, dc] of moves) {
        const nr = row + dr;
        const nc = col + dc;

        if (nr < 0 || nr > 2 || nc < 0 || nc > 2) {
            continue;
        }

        const next = [...state];
        const target = nr * 3 + nc;

        [next[blank], next[target]] =
            [next[target], next[blank]];

        result.push(next);
    }

    return result;
}

function runComparisonSearch(start, goal, algorithm, heuristic, depthLimit) {
    const startKey = comparisonKey(start);
    const goalKey = comparisonKey(goal);
    const startedAt = performance.now();

    let generated = 1;
    let expanded = 0;
    let maxDepth = 0;
    let foundNode = null;
    let limitReached = false;

    const makeNode = (state, parent, depth) => ({
        state,
        key: comparisonKey(state),
        parent,
        depth,
        h: comparisonHeuristic(state, goal, heuristic),
        g: depth
    });

    const reconstructPath = node => {
        const path = [];

        while (node) {
            path.push(node.state);
            node = node.parent;
        }

        return path.reverse();
    };

    const finish = () => {
        const elapsed = performance.now() - startedAt;
        const path = foundNode ? reconstructPath(foundNode) : [];

        return {
            algorithm,
            found: Boolean(foundNode),
            moves: foundNode ? foundNode.depth : null,
            generated,
            expanded,
            maxDepth,
            time: Number(elapsed.toFixed(3)),
            memory: Number((generated * 0.5).toFixed(2)),
            path
        };
    };

    if (startKey === goalKey) {
        foundNode = makeNode(start, null, 0);
        return finish();
    }

    if (!comparisonSolvable(start, goal)) {
        return finish();
    }

    const startNode = makeNode(start, null, 0);

    // Breadth-First Search
    if (algorithm === "BFS") {
        const queue = [startNode];
        let head = 0;
        const visited = new Set([startKey]);

        while (head < queue.length) {
            if (expanded >= COMPARISON_NODE_LIMIT) {
                limitReached = true;
                break;
            }

            const node = queue[head++];
            expanded++;
            maxDepth = Math.max(maxDepth, node.depth);

            for (const state of comparisonSuccessors(node.state)) {
                const key = comparisonKey(state);

                if (visited.has(key)) continue;

                visited.add(key);
                generated++;

                const child = makeNode(state, node, node.depth + 1);

                if (key === goalKey) {
                    foundNode = child;
                    break;
                }

                queue.push(child);
            }

            if (foundNode) break;
        }

        return { ...finish(), limitReached };
    }

    // Depth-First Search and Depth-Limited Search
    // Iterative Deepening DFS
    if (["DFS", "DLS", "IDDLS"].includes(algorithm)) {
        const searchDepthLimit =
            algorithm === "DFS" ? 100 :
                algorithm === "DLS" ? depthLimit : 100;

        function depthFirst(limit) {
            const stack = [{
                node: startNode,
                nextIndex: 0,
                successors: null
            }];

            const pathKeys = new Set([startKey]);

            while (stack.length > 0) {
                if (expanded >= COMPARISON_NODE_LIMIT) {
                    limitReached = true;
                    return null;
                }

                const frame = stack[stack.length - 1];
                const node = frame.node;

                if (node.key === goalKey) return node;

                if (frame.successors === null) {
                    expanded++;
                    maxDepth = Math.max(maxDepth, node.depth);
                    frame.successors = comparisonSuccessors(node.state);
                }

                if (
                    node.depth >= limit ||
                    frame.nextIndex >= frame.successors.length
                ) {
                    pathKeys.delete(node.key);
                    stack.pop();
                    continue;
                }

                const state = frame.successors[frame.nextIndex++];
                const key = comparisonKey(state);

                if (pathKeys.has(key)) continue;

                generated++;

                const child = makeNode(state, node, node.depth + 1);
                pathKeys.add(key);

                stack.push({
                    node: child,
                    nextIndex: 0,
                    successors: null
                });
            }

            return null;
        }

        if (algorithm === "IDDLS") {
            for (let limit = 0; limit <= searchDepthLimit; limit++) {
                foundNode = depthFirst(limit);

                if (foundNode || limitReached) break;
            }
        } else {
            foundNode = depthFirst(searchDepthLimit);
        }

        return { ...finish(), limitReached };
    }

    // Greedy Best-First Search and A*
    const frontier = [startNode];
    const bestCost = new Map([[startKey, 0]]);
    const closed = new Set();

    while (frontier.length > 0) {
        if (expanded >= COMPARISON_NODE_LIMIT) {
            limitReached = true;
            break;
        }

        frontier.sort((a, b) => {
            const scoreA = algorithm === "GBFS"
                ? a.h
                : a.g + a.h;

            const scoreB = algorithm === "GBFS"
                ? b.h
                : b.g + b.h;

            return scoreA - scoreB || a.h - b.h;
        });

        const node = frontier.shift();

        if (closed.has(node.key)) continue;

        if (node.key === goalKey) {
            foundNode = node;
            break;
        }

        closed.add(node.key);
        expanded++;
        maxDepth = Math.max(maxDepth, node.depth);

        for (const state of comparisonSuccessors(node.state)) {
            const key = comparisonKey(state);
            const newCost = node.g + 1;

            if (closed.has(key)) continue;

            if (
                bestCost.has(key) &&
                bestCost.get(key) <= newCost
            ) {
                continue;
            }

            bestCost.set(key, newCost);
            generated++;

            const child = makeNode(state, node, newCost);

            if (key === goalKey) {
                foundNode = child;
                break;
            }

            frontier.push(child);
        }

        if (foundNode) break;
    }

    return { ...finish(), limitReached };
}

function renderComparisonResults(results) {
    const tbody = document.getElementById("comparison-results");
    tbody.replaceChildren();

    for (const result of results) {
        const row = document.createElement("tr");

        const values = [
            result.algorithm,
            result.found ? "Yes" : "No",
            result.found ? result.moves : "—",
            result.generated,
            result.expanded,
            result.maxDepth,
            result.time.toFixed(3),
            result.memory.toFixed(2)
        ];

        for (const value of values) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
}

document
    .getElementById("run-comparison-btn")
    .addEventListener("click", () => {
        const status = document.getElementById("comparison-status");
        const button = document.getElementById("run-comparison-btn");

        try {
            const start = parseComparisonState(
                document.getElementById("compare-initial").value
            );

            const goal = parseComparisonState(
                document.getElementById("compare-goal").value
            );

            const heuristic =
                document.getElementById("compare-heuristic").value;

            const depthLimit = Number(
                document.getElementById("compare-depth-limit").value
            );

            if (
                !Number.isInteger(depthLimit) ||
                depthLimit < 0 ||
                depthLimit > 100
            ) {
                throw new Error("Depth limit must be between 0 and 100.");
            }

            if (!comparisonSolvable(start, goal)) {
                throw new Error(
                    "This initial state cannot reach the selected goal state."
                );
            }

            button.disabled = true;
            status.textContent = "Running algorithms...";

            // Let the browser update the status before the searches begin.
            setTimeout(() => {
                try {
                    const algorithms = [
                        "BFS",
                        "DFS",
                        "DLS",
                        "IDDLS",
                        "GBFS",
                        "A*"
                    ];

                    const results = algorithms.map(algorithm =>
                        runComparisonSearch(
                            start,
                            goal,
                            algorithm,
                            heuristic,
                            depthLimit
                        )
                    );

                    renderComparisonResults(results);

                    const capped = results.some(r => r.limitReached);

                    status.textContent = capped
                        ? "Comparison finished. One or more searches reached the node limit."
                        : "Comparison completed successfully. Results are from actual executions.";
                } catch (error) {
                    status.textContent = error.message;
                } finally {
                    button.disabled = false;
                }
            }, 30);
        } catch (error) {
            status.textContent = error.message;
        }
    });
