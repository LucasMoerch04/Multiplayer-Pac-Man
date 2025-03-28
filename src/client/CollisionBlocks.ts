import { deflateRaw } from "zlib";
import { collisions } from "./Collisionstext";

const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

interface Boundary {
    x: number,
    y: number,
    width: number,
    height: number,
    draw: () => void
}

class Boundaries implements Boundary {
    public width: number = 32;
    public height: number = 32
    constructor(
        public x: number,
        public y: number,
    ) {}

    draw(){
    ctx.fillStyle = "red"
    ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const boundaries = new Boundaries(0,0)

//Lige nu indsætter den automatisk alle  collision blocks henover en row.
//Når vi får importeret collision blocks fra tiled skal den opdateres til at gøre det for hver row
// og den skal også kun gøre det hvis der står "2106" på den plads
for (let i = 0; i < canvas.width; i+=boundaries.width){
    const boundaries = new Boundaries(i,0)
    boundaries.draw()
}
export { Boundaries, boundaries };

// What is in the CollisionBlock object
interface CollisionBlock {
    x: number;
    y: number;
    width: number;
    height: number;
    type: "solid";
}

function insertCollisionBlock(i: number){
    const tileSize = 1;
    const x = (i / 52) * tileSize;
    const y = (i / 32) * tileSize;

    const collisionBlock: CollisionBlock = {
        x: x,
        y: y,
        width: tileSize,
        height: tileSize,
        type: "solid",
    };

    ctx.fillStyle ="blue";
    ctx.fillRect(x, y, 1, 1)

    // Console logging to confirm the positions of the collision blocks, delete at a later stage.
    console.log("Inserted collision block at" + x, y); 
}
    for(let i = 0; i < 32; i++)  {  
        for (let j = 0; j < 52; j++) {
            if (collisions[j] === 0){
                continue;
                // Doesn't insert anything if the value in the file is '0'
            } else if (collisions[j] === 1) {
                insertCollisionBlock(j); // Inserts a collision block on the space
            } else {
                console.log("Error in file reading") 
            }
        }
    }