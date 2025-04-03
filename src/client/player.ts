import { Boundaries, boundaryArray } from './CollisionBlocks';
import { backgroundImage } from './Canvas';

const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
//Det er en  Class da man så vil kunne oprette endnu en spille hvilke jeg tænker er nødvendigt i en multiplayer

class Player {
  //Borders skal initialiseres før man kan bruge den i update border
  //public er fordi dette er variable som kan tilgås alle steder fra
  public leftBorder: number = 0;
  public rightBorder: number = 0;
  public topBorder: number = 0;
  public bottomBorder: number = 0;
  //width, height og color skal ikke kunne skiftes i constructoren. derfor bliver initialiseret før
  public width: number = 32;
  public height: number = 32;
  public color: string = "yellow";

  constructor(
    //constructor så man kan lave en ny spiller på en vilkårlig x og y koordinat
    public x: number,
    public y: number,
  ) {}
  //opdatere borders ved at sætte borders til den korrekte x eller y koordinat
  updateBorders() {
    this.leftBorder = this.x;
    this.rightBorder = this.x + this.width;
    this.topBorder = this.y;
    this.bottomBorder = this.y + this.height;
  }

  draw() {
    //tegner spilleren, hitboxen og opdatere borders
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.updateBorders();
  }

    moveRight() {
        //bevæger karakteren ved at cleare den gamle firkant og derefter printe den 5px længere den ene vej
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.x += 5;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        this.draw();
    }

    moveLeft() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.x -= 5;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        this.draw();
    }

    moveUp() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.y -= 5;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        this.draw();
    }

    moveDown() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.y += 5;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        this.draw();
    }
    //laver denne function booleen så hvis det næste træk er inde i en collision block vil den returnere True
    //ellers vil den returnere False da det er default
    checkCollision(direction: string, boundaries: Boundaries[]): boolean {
        for (const boundary of boundaries) {
            switch (direction) {
                case 'right':
                    if (
                        this.x + this.width + 5 >= boundary.x &&
                        this.x <= boundary.x + boundary.width &&
                        this.y + this.height >= boundary.y &&
                        this.y <= boundary.y + boundary.height
                    ) {
                        return true;
                    }
                    break;
                case 'left':
                    if (
                        this.x - 5 <= boundary.x + boundary.width &&
                        this.x + this.width >= boundary.x &&
                        this.y + this.height >= boundary.y &&
                        this.y <= boundary.y + boundary.height
                    ) {
                        return true;
                    }
                    break;
                case 'up':
                    if (
                        this.y - 5 <= boundary.y + boundary.height &&
                        this.y + this.height >= boundary.y &&
                        this.x + this.width >= boundary.x &&
                        this.x <= boundary.x + boundary.width
                    ) {
                        return true;
                    }
                    break;
                case 'down':
                    if (
                        this.y + this.height + 5 >= boundary.y &&
                        this.y <= boundary.y + boundary.height &&
                        this.x + this.width >= boundary.x &&
                        this.x <= boundary.x + boundary.width
                    ) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    }
}
// laver en ny spiller i midten af canvas
const localPlayer = new Player(70, 70);

// tegner spilleren
localPlayer.draw();

//Tegner én boundary lige nu. Skal opdateres til at lave et array med arrays af boundary blocks


// Eventlistener tjekker efter om W,A,S,D bliver trykket
document.addEventListener("keydown", function (event) {
  //!!!!!Måske kunne man lave dette til en switch så det er mere tydeligt hvad der sker
  switch (event.key) {
    case "d":
    case "ArrowRight":
      if (localPlayer.checkCollision("right", boundaryArray)) {
        console.log("colliding right");
        return;
      } else {
        localPlayer.moveRight();
      }
      break;
    case "a":
    case "ArrowLeft":
      if (localPlayer.checkCollision("left", boundaryArray)) {
        console.log("colliding left");
        return;
      } else {
        localPlayer.moveLeft();
      }
      break;
    case "w":
    case "ArrowUp":
      if (localPlayer.checkCollision("up", boundaryArray)) {
        console.log("colliding up");
        return;
      } else {
        localPlayer.moveUp();
      }
      break;
    case "s":
    case "ArrowDown":
      if (localPlayer.checkCollision("down", boundaryArray)) {
        console.log("colliding down");
        return;
      } else {
        localPlayer.moveDown();
      }
  }
});
