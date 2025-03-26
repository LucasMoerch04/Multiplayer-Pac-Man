import { deflateRaw } from "zlib";

const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;





class Boundaries  {
    public width: number = 32;
    public height: number = 32;
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
// for (let i = 0; i < canvas.width; i+=boundaries.width){
//     const boundaries = new Boundaries(i,0)
//     boundaries.draw()
// }
export { Boundaries, boundaries };





