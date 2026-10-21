# AI 8-Puzzle Solver — Greedy Best-First Search

An interactive web application developed as an Artificial Intelligence digital assignment to visualize the 8-Puzzle problem using state-space search algorithms.

The application allows users to configure puzzle states, solve puzzles, visualize the search process, and compare the performance of different search algorithms.

## Student Details

- **Name:** Akshada Vaidya
- **Registration Number:** 24BDS0343
- **Course:** B.Tech Computer Science and Engineering — Data Science
- **Institution:** Vellore Institute of Technology (VIT), Vellore
- **Subject:** Artificial Intelligence
- **Assignment:** Interactive 8-Puzzle Problem Solver using AI Search Algorithms
- **Assigned Algorithm:** Greedy Best-First Search (GBFS)

## Project Description

The 8-Puzzle is a sliding-tile puzzle consisting of eight numbered tiles and one empty space arranged in a 3 × 3 grid. The objective is to move the tiles into a specified goal configuration by sliding adjacent tiles into the empty space.

This project demonstrates how search algorithms explore possible states to find a path from an initial state to a goal state. It provides an interactive interface to observe the solving process and examine search statistics.

The main solver implements the assigned Greedy Best-First Search algorithm. A separate comparison page allows users to experiment with multiple search algorithms using the same puzzle instance.

## Technologies Used

- **HTML5:** Structure and content of the web pages.
- **CSS3:** Styling, layout, and visual presentation.
- **JavaScript (ES6):** Puzzle logic, search algorithms, heuristics, and interactive visualization.
- **Bootstrap 5:** UI framework for interface components and responsive layout.
- **Git and GitHub:** Version control and source-code hosting.
- **GitHub Pages:** Deployment and hosting of the web application.

## Features

- Interactive 3 × 3 puzzle board.
- Custom initial-state and goal-state input.
- Random solvable puzzle generation.
- Input validation and solvability checks.
- Greedy Best-First Search as the assigned main solver algorithm.
- Heuristic selection using Misplaced Tiles and Manhattan Distance.
- Visualization of generated successor states and search progress.
- Animated puzzle-solving steps.
- Controls for solving, stepping through, playing, pausing, resuming, moving to the previous step, resetting, and adjusting animation speed.
- Search statistics, including generated nodes, expanded nodes, depth, and solution moves.
- Separate algorithm information page.
- Interactive comparison page for evaluating multiple search algorithms.
- Solution summary and performance measurements.

## Search Algorithms

The project includes the following algorithms in its algorithm information and comparison sections:

| Algorithm | Description |
|---|---|
| Breadth-First Search (BFS) | Explores states level by level. |
| Depth-First Search (DFS) | Explores one branch deeply before backtracking. |
| Depth-Limited Search (DLS) | Performs depth-first search up to a specified limit. |
| Iterative Deepening Depth-Limited Search (IDDLS) | Repeats depth-limited search with increasing limits. |
| Greedy Best-First Search (GBFS) | Selects the frontier state with the lowest heuristic value. |
| A* Search | Uses path cost and heuristic estimates to prioritize states. |

**Assigned algorithm:** Greedy Best-First Search (GBFS).

The comparison page allows the algorithms to be evaluated on the same initial and goal states. The reported results depend on the selected puzzle, heuristic, depth limit, and execution environment.

## Heuristic Functions

Two heuristic functions are supported for informed search:

### 1. Misplaced Tiles

Counts the number of numbered tiles that are not in their goal positions. The empty tile is excluded.

### 2. Manhattan Distance

Calculates the total horizontal and vertical distance of each numbered tile from its goal position. The empty tile is excluded.

For Greedy Best-First Search, the evaluation function is:

**f(n) = h(n)**

For A* Search, the evaluation function is:

**f(n) = g(n) + h(n)**

Where:

- `g(n)` is the path cost from the initial state to the current state.
- `h(n)` is the heuristic estimate of the remaining distance to the goal.
- `f(n)` is the evaluation value used to prioritize states.

## Project Pages

### 1. Home Page — Puzzle Solver

The home page provides the puzzle interface, initial and goal state configuration, heuristic selection, solving controls, and visualization of the search process.

### 2. Algorithm Information

The algorithm information page explains the search algorithms, their working principles, advantages, limitations, complexity, completeness, and optimality.

### 3. Algorithm Comparison

The comparison page runs the available algorithms on a common puzzle instance and displays their results and performance statistics.

## Screenshots

The following screenshots demonstrate the application's interface, puzzle-solving process, search statistics, and supporting pages.

### Screenshot 1

![Project Screenshot 1](images/Screenshot%202026-10-21%20at%2011.20.34%E2%80%AFAM.png)

### Screenshot 2

![Project Screenshot 2](images/Screenshot%202026-10-21%20at%2011.20.42%E2%80%AFAM.png)

### Screenshot 3

![Project Screenshot 3](images/Screenshot%202026-10-21%20at%2011.20.59%E2%80%AFAM.png)

### Screenshot 4

![Project Screenshot 4](images/Screenshot%202026-10-21%20at%2011.21.08%E2%80%AFAM.png)

### Screenshot 5

![Project Screenshot 5](images/Screenshot%202026-10-21%20at%2011.21.15%E2%80%AFAM.png)

### Screenshot 6

![Project Screenshot 6](images/Screenshot%202026-10-21%20at%2011.21.34%E2%80%AFAM.png)

### Screenshot 7

![Project Screenshot 7](images/Screenshot%202026-10-21%20at%2011.21.43%E2%80%AFAM.png)

### Screenshot 8

![Project Screenshot 8](images/Screenshot%202026-10-21%20at%2011.21.52%E2%80%AFAM.png)

### Screenshot 9

![Project Screenshot 9](images/Screenshot%202026-10-21%20at%2011.22.01%E2%80%AFAM.png)

### Screenshot 10

![Project Screenshot 10](images/Screenshot%202026-10-21%20at%2011.22.12%E2%80%AFAM.png)

### Screenshot 11

![Project Screenshot 11](images/Screenshot%202026-10-21%20at%2011.22.19%E2%80%AFAM.png)

### Screenshot 12

![Project Screenshot 12](images/Screenshot%202026-10-21%20at%2011.22.27%E2%80%AFAM.png)

### Screenshot 13

![Project Screenshot 13](images/Screenshot%202026-10-21%20at%2011.22.45%E2%80%AFAM.png)

## Repository Structure

```text
AI-8-Puzzle-Solver/
├── index.html
├── algorithms.html
├── comparison.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── comparison.js
├── images/
│   └── Project screenshots
└── README.md
```

## How to Run the Project Locally

### Prerequisites

- A modern web browser.
- Visual Studio Code or another code editor.
- Git, if you want to clone the repository.

### Option 1: Run from the downloaded project

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser or using the VS Code integrated browser.
4. Use the navigation menu to access the algorithm information and comparison pages.

Bootstrap is loaded through a CDN, so an internet connection is required for its stylesheet to load.

### Option 2: Clone from GitHub

```bash
git clone https://github.com/akshada-31/AI-8-Puzzle-Solver.git
cd AI-8-Puzzle-Solver
```

Open `index.html` in your browser to run the application.

## Deployment

The application is hosted using GitHub Pages.

- **GitHub Repository:** https://github.com/akshada-31/AI-8-Puzzle-Solver
- **Live Website:** https://akshada-31.github.io/AI-8-Puzzle-Solver/

## References

1. Russell, S. J., and Norvig, P. *Artificial Intelligence: A Modern Approach*. Pearson.
2. [MDN Web Docs — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
3. [MDN Web Docs — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
4. [MDN Web Docs — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
5. [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
6. [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Acknowledgement

This project was developed as an individual Artificial Intelligence digital assignment to explore state-space search, heuristic functions, puzzle-solving strategies, and interactive visualization using web technologies.
## Demo Video

[Watch the 3–5 Minute Project Demonstration]
https://drive.google.com/file/d/14Pq1Co-rozPDXA9tIPJ1OkHVpRx5380V/view?usp=drive_link