# Multiplayer-Pac-Man

_Project for P2 by SW2_

---
![Ghost eaten by AI PacMan](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmkwNGhnMXNyejdxeWFuZW9vdm8xcXJkN2lzbXFwYWNsYmNsMWFuZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4cH0RhoPrqleoO9NwD/giphy.gif)

![Team color switch](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW10YmI4NHRjdmw3bjhhMDhxMDk0aWw4Z2U5YTZtZHBycG9vMzB0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GZJPG2Ep0bpFuUjXkG/giphy.gif)

## 🕹️ Game Mechanics

- **Real-time Multiplayer:**  
  Uses WebSocket to let users play together in real time.

- **Pacman AI:**  
  Pacman switches between *Hunt Mode* and *Switch Mode* based on player actions.

- **Cherry Power-Up:**  
  Picking up a cherry puts Pacman in *Hunt Mode* for 10 seconds, aggressively chasing players.

- **Speed Mechanics:**  
  - Pacman moves at **2x the speed** of ghosts.
  - Ghost players must **collaborate** strategically to catch Pacman.

- **Power-Ups:**  
  - **Elevators/Teleporters** allow instant movement across the map.
  - **Redbulls** slow down the player who picks it up but **boost their team’s speed** for 10 seconds.

- **Team Color Switcher:**  
  Dynamic **UI color change** based on team, affecting the entire team's interface.
