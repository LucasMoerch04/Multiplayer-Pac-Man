import { backgroundImage } from '../client/Canvas';

const canvas: HTMLCanvasElement = document.getElementById(
    "gameCanvas",
  ) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export class Player {
    //Borders skal initialiseres før man kan bruge den i update border
    //public er fordi dette er variable som kan tilgås alle steder fra
    public leftBorder: number = 0;
    public rightBorder: number = 0;
    public topBorder: number = 0;
    public bottomBorder: number = 0;
    //width, height og color skal ikke kunne skiftes i constructoren. derfor bliver initialiseret før
    public width: number = 32;
    public height: number = 32;
    public x: number;
    public y: number;
    public color: string;

    constructor(x: number, y: number, color: string) {
      this.x = x
      this.y = y
      this.color = color
    }
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
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        this.updateBorders();
      }
  }