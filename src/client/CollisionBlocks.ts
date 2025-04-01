
const canvas: HTMLCanvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;





class Boundary  {
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
const testboundaries = new Boundary(0, 0);

//Lige nu indsætter den automatisk alle  collision blocks henover en row.
//Når vi får importeret collision blocks fra tiled skal den opdateres til at gøre det for hver row
// og den skal også kun gøre det hvis der står "2106" på den plads
// for (let i = 0; i < canvas.width; i+=boundaries.width){
//     const boundaries = new Boundaries(i,0)
//     boundaries.draw()
// }
export { Boundary};





