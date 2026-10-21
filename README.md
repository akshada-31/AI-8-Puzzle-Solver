
# Interactive 8-Puzzle Problem Solver

## Course Information
- **Course:** Artificial Intelligence
- **Assignment:** AI Digital Assignment
- **Student Name:** Akshada Vaidya
- **Registration Number:** 24BDS0343
- **Assigned Algorithm:** Greedy Best-First Search (GBFS)

## Project Overview
This project is an interactive web-based solver for the classic 8-Puzzle problem. It allows users to configure the initial and goal states, solve the puzzle using Greedy Best-First Search, and visualize the search process and solution path.

The project also provides information about search algorithms and an experimental comparison page to evaluate different algorithms on the same puzzle instance.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- VS Code Integrated Browser for local testing

## Implemented Features
- Interactive 3 × 3 puzzle board
- Custom initial and goal state input
- Validation of puzzle states and solvability
- Random solvable puzzle generation
- Greedy Best-First Search implementation
- Misplaced Tiles and Manhattan Distance heuristics
- Step-by-step search visualization
- Play, pause, resume, next-step, and previous-step controls
- Search statistics, including generated and expanded nodes
- Frontier, explored states, and successor-state visualization
- Algorithm information and theoretical comparison
- Experimental comparison of BFS, DFS, DLS, IDDLS, GBFS, and A*

## Algorithms
The main puzzle solver implements the assigned algorithm: **Greedy Best-First Search (GBFS)**.

The experimental comparison page includes:
1. Breadth-First Search (BFS)
2. Depth-First Search (DFS)
3. Depth-Limited Search (DLS)
4. Iterative Deepening Depth-First Search (IDDLS)
5. Greedy Best-First Search (GBFS)
6. A* Search

## Heuristics
### Misplaced Tiles
Counts the numbered tiles that are not in their corresponding goal positions. The blank tile is excluded.

### Manhattan Distance
Calculates the sum of the horizontal and vertical distances of each numbered tile from its goal position. The blank tile is excluded.

## Project Structure
```text
AICS/
├── index.html
├── algorithms.html
├── comparison.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── comparison.js
├── assets/
├── images/
└── README.md
```

## How to Run
1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the VS Code Integrated Browser or another browser.
4. Use the navigation links to access the solver, algorithm information, and comparison pages.

An internet connection is required to load the Bootstrap stylesheet from its CDN.

## Experimental Comparison
The comparison page runs the six algorithms against the same initial and goal states. It reports the solution status, number of moves, generated nodes, expanded nodes, maximum depth, execution time, and approximate memory usage.

Results may vary depending on the selected puzzle, heuristic, depth limit, and search implementation. Memory figures are estimates rather than direct measurements of actual browser memory consumption.

## Screenshots
Add screenshots of the following after testing the final version:
- Main GBFS solver
- Search visualization during execution
- Final solution and statistics
- Algorithm information page
- Experimental comparison results

## Deployment
**GitHub Repository:** Add your repository URL here.

**Live Website (GitHub Pages):** Add your deployed website URL here.

## References
- Russell, S. J., and Norvig, P. *Artificial Intelligence: A Modern Approach.*
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Disclaimer
This project was developed as an academic assignment to demonstrate AI search algorithms and their visualization.
