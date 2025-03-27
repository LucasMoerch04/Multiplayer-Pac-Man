interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }

  class PacMan implements Entity {
    x: number;
    y: number;
    width: number = 20;
    height: number = 20;
    color: string = "yellow";
    speed: number;
  
    constructor(x: number, y: number, speed: number = 4) {
      this.x = x;
      this.y = y;
      this.speed = speed;
    }
  
    move() {
      // Simple AI movement (placeholder, replace with pathfinding)
      this.x += Math.random() > 0.5 ? this.speed : -this.speed;
      this.y += Math.random() > 0.5 ? this.speed : -this.speed;
    }
  }
  
  class Ghost implements Entity {
    x: number;
    y: number;
    width: number = 20;
    height: number = 20;
    color: string;
    speed: number;
    playerId: string; // To identify the player controlling this ghost
  
    constructor(x: number, y: number, color: string, playerId: string, speed: number = 3) {
      this.x = x;
      this.y = y;
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

