// Class representing the Pac-Man character
var PacMan = /** @class */ (function () {
    function PacMan(x, y, speed) {
        if (speed === void 0) { speed = 4; }
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = "yellow";
        this.speed = speed;
    }
    PacMan.prototype.move = function () {
        this.x += Math.random() > 0.5 ? this.speed : -this.speed;
        this.y += Math.random() > 0.5 ? this.speed : -this.speed;
    };
    return PacMan;
}());
// Class representing a Ghost character
var Ghost = /** @class */ (function () {
    function Ghost(x, y, color, playerId, speed) {
        if (speed === void 0) { speed = 3; }
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = color;
        this.playerId = playerId;
        this.speed = speed;
    }
    Ghost.prototype.move = function (direction) {
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
    };
    return Ghost;
}());
// Test logic
var pacman = new PacMan(50, 50);
var ghost = new Ghost(100, 100, "red", "player1");
console.log("Before move:");
console.log("PacMan:", pacman);
console.log("Ghost:", ghost);
pacman.move();
ghost.move("left");
console.log("After move:");
console.log("PacMan:", pacman);
console.log("Ghost:", ghost);
