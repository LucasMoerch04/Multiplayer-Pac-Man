<<<<<<< HEAD
=======
import { deflateRaw } from "zlib";
import { collisions } from "./Collisionstext";
>>>>>>> refs/remotes/origin/Collision-blocks

const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

interface Boundary {
    x: number,
    y: number,
    width: number,
    height: number,
    draw: () => void
}

class Boundary  {
    public width: number = 32;
    public height: number = 32;
    constructor(
        public x: number,
        public y: number,
    ) {}

    draw(){
<<<<<<< HEAD
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//sådan her opretter du en ny collision block, parametrene er hvilke x og y koordinat blokken skal sættes på,
// så skal du bare huske at kalde testboundaries.draw(); hvis du gerne ville kunne se den på skærmen
const testboundaries = new Boundary(0, 0);
=======
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

//const boundaries = new Boundaries(0,0)
>>>>>>> refs/remotes/origin/Collision-blocks

//Lige nu indsætter den automatisk alle  collision blocks henover en row.
//Når vi får importeret collision blocks fra tiled skal den opdateres til at gøre det for hver row
// og den skal også kun gøre det hvis der står "2106" på den plads
// for (let i = 0; i < canvas.width; i+=boundaries.width){
//     const boundaries = new Boundaries(i,0)
//     boundaries.draw()
// }
<<<<<<< HEAD
export { Boundary};


=======
>>>>>>> refs/remotes/origin/Collision-blocks

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
for (let i=0 , j=-1; i < collisions.length; i++) {
        if (i % 52 === 0) {
            j++;
        }
        console.log(collisions[i]);
        if (collisions[i] === 0) {
            console.log("EWEWe");
            continue;
            // Doesn't insert anything if the value in the file is '0'
        } else if (collisions[i] === 1) {
            //insertCollisionBlock(j, i); // Inserts a collision block on the space
            const boundaries = new Boundaries(32 * (i % 52), 32 * j);
            boundaries.draw();
        } else {
            console.log("Error in file reading");
        }
}
export { Boundaries };