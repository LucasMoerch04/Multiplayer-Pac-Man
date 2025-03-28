# Multiplayer-Pac-Man

_Project for P2 by SW2_

---

### Tips for Development

- **Separation of Concerns:**  
  Keep client-side code (input, rendering, immediate feedback) separate from server-side code (authoritative game state, collision validation, synchronization).

- **Modular Code Structure:**  
  Create reusable functions for collision detection, movement, and event handling. This improves maintainability and testability.

- **Consistent Data Structures:**  
  Use the same data formats (e.g., for positions and dimensions) on both the client and server to simplify state synchronization.

- **Testing:**  
  Write unit tests for critical functions (collision, movement, power-up logic) to catch bugs early.

- **Documentation:**  
  Document your functions and code modules to ensure clarity, especially for team members who are new to programming.

- **Pair-programming:**
  Sit down together when writing code. Let one person be the primary writer. This can both be done physically and online. It helps to talk about the task at hand solve it together. This also ensures that we all collaborate to the project and understand it's functionality.

- **Communication:**  
  Schedule regular meetings to discuss design decisions and implementation challenges. This helps ensure everyone is on the same page.

## Git Guidelines

### Branching Guidelines

- **Main Branch (`main`):**  
  This is the stable, production-ready branch.

- **Development Branch (`develop`):**  
  This branch holds the latest tested code. All features are merged into `develop` via pull requests.

- **Feature Branches (`feature/*`):**  
  Each new feature or bug fix is developed on its own branch, branched off from `develop`.  
  **Example:** `feature/player-movement`

- **Pull Requests:**  
  Once a feature is complete, push the feature branch and create a pull request to merge into `develop`.  
  **Note:** Each pull request requires at least 1 approval before merging.

### Common Git Commands

- **To get the latest changes:**
  ```
  git checkout develop
  git pull origin develop
  ```
- **Create a New Feature Branch:**
  ```bash
  git checkout -b feature/your-feature-name
  ```
## Linting and formatting
  ```bash
  npm run lint
  ```
  ```bash
  npm run lint:fix
  ```
  ```bash
  npm run format
  ```
  
### Running the project with Docker
  ```bash
  npm run docker:dev
  ```
Other commands can be found in the `package.json`.


