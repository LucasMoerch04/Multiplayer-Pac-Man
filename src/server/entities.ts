// Define a common structure for game entities
interface Entity {
  x: number;         // X-coordinate (horizontal position)
  y: number;         // Y-coordinate (vertical position)
  width: number;     // Width of the entity
  height: number;    // Height of the entity
  color: string;     // Color used for rendering the entity
}

// Class representing the Pac-Man character
class PacMan implements Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;

  constructor(x: number, y: number, speed: number = 4) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = "yellow";
    this.speed = speed;
  }

  move() {
    this.x += Math.random() > 0.5 ? this.speed : -this.speed;
    this.y += Math.random() > 0.5 ? this.speed : -this.speed;
  }
}

// Class representing a Ghost character
class Ghost implements Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  playerId: string;

  constructor(x: number, y: number, color: string, playerId: string, speed: number = 3) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = color;
    this.playerId = playerId;
    this.speed = speed;
  }

  move(direction: "up" | "down" | "left" | "right") {
    switch (direction) {
      case "up":
        this.y -= this.speed;
        break;
      case "down":
        this.y += this.speed;
        break;
      case "left":
        this.x -= this.speed;
        break;
      case "right":
        this.x += this.speed;
        break;
    }
  }
}

// Test logic
const pacman = new PacMan(50, 50);
const ghost = new Ghost(100, 100, "red", "player1");

console.log("Before move:");
console.log("PacMan:", pacman);
console.log("Ghost:", ghost);

pacman.move();
ghost.move("left");

console.log("After move:");
console.log("PacMan:", pacman);
console.log("Ghost:", ghost);
