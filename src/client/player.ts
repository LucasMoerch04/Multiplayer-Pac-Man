import { Boundaries } from './CollisionBlocks';

const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
let collidingStatus: number = -1;
//Det er en  Class da man så vil kunne oprette endnu en spille hvilke jeg tænker er nødvendigt i en multiplayer
class Player {
    //Borders skal initialiseres før man kan bruge den i update border
    public leftBorder: number = 0;
    public rightBorder: number = 0;
    public topBorder: number = 0;
    public bottomBorder: number = 0;
    //width, height og color skal ikke kunne skiftes i constructoren. derfor bliver initialiseret før
    public width: number = 32;
    public height: number = 32;
    public color: string = "yellow"

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
        this.draw();
    }

    moveLeft() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.x -= 5;
        this.draw();
    }

    moveUp() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.y -= 5;
        this.draw();
    }

    moveDown() {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.y += 5;
        this.draw();
    }
    //laver denne function booleen så hvis det næste træk er inde i en collision block vil den returnere True
    //ellers vil den returnere False da det er default
    checkCollision(direction: string, boundary: Boundaries): boolean {
        switch (direction) {
            case 'right':
                return (
                    this.x + this.width + 5 >= boundary.x &&
                    this.x <= boundary.x + boundary.width &&
                    this.y + this.height >= boundary.y &&
                    this.y <= boundary.y + boundary.height
                );
            case 'left':
                return (
                    this.x - 5 <= boundary.x + boundary.width &&
                    this.x + this.width >= boundary.x &&
                    this.y + this.height >= boundary.y &&
                    this.y <= boundary.y + boundary.height
                );
            case 'up':
                return (
                    this.y - 5 <= boundary.y + boundary.height &&
                    this.y + this.height >= boundary.y &&
                    this.x + this.width >= boundary.x &&
                    this.x <= boundary.x + boundary.width
                );
            case 'down':
                return (
                    this.y + this.height + 5 >= boundary.y &&
                    this.y <= boundary.y + boundary.height &&
                    this.x + this.width >= boundary.x &&
                    this.x <= boundary.x + boundary.width
                );
            default:
                return false;
        }
    }
}

// laver en ny spiller i midten af canvas
const player = new Player(100, 100);

// tegner spilleren
player.draw();

//Tegner én boundary lige nu. Skal opdateres til at lave et array med arrays af boundary blocks
const testboundaries = new Boundaries(0, 0);
    testboundaries.draw();

// Eventlistener tjekker efter om W,A,S,D bliver trykket
document.addEventListener("keydown", function(event) {
    
//!!!!!Måske kunne man lave dette til en switch så det er mere tydeligt hvad der sker
    if (event.key === "d" || event.key ==="ArrowRight") {
        if (player.checkCollision('right', testboundaries)) {
            return;
        } else {
            player.moveRight();
        }
    } else if (event.key === "a" || event.key === "ArrowLeft") {
        if (player.checkCollision('left', testboundaries)) {
            return;
        } else {
            player.moveLeft();
        }
    } else if (event.key === "w" || event.key === "ArrowUp") {
        if (player.checkCollision('up', testboundaries)) {
            return;
        } else {
            player.moveUp();
        }
    } else if (event.key === "s" || event.key === "ArrowDown") {
        if (player.checkCollision('down', testboundaries)) {
            return;
        } else {
            player.moveDown();
        }
    }
});
