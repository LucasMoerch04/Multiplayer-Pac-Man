# Multiplayer-Pac-Man

_Project for P2 by SW2_

---

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
### Running the project with Docker
  ```bash
  npm run docker:dev
  ```
Other commands can be found in the `package.json`.


