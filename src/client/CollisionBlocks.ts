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

class Boundaries  {
    public width: number = 32;
    public height: number = 32;
    constructor(
        public x: number,
        public y: number,
    ) {}

    draw(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
//sådan her opretter du en ny collision block, parametrene er hvilke x og y koordinat blokken skal sættes på,
// så skal du bare huske at kalde testboundaries.draw(); hvis du gerne ville kunne se den på skærmen


// What is in the CollisionBlock object

    // Console logging to confirm the positions of the collision blocks, delete at a later stage.

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
            // boundaries.draw();
        } else {
            console.log("Error in file reading");
        }
}
export { Boundaries };