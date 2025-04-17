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
    this.width = 32;
    this.height = 32;
    this.color = "yellow";
    this.speed = speed;            
  }

  move() {
    if (Math.random() > 0.5) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
  
    if (Math.random() > 0.5) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
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
    this.width = 32;
    this.height = 32;
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