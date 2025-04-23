// background canvas
export const bgCanvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas",
) as HTMLCanvasElement;
export const bgCtx: CanvasRenderingContext2D = bgCanvas.getContext("2d")!;

// foreground canvas
export const fgCanvas: HTMLCanvasElement = document.getElementById(
  "gameState",) as HTMLCanvasElement;
export const fgCtx: CanvasRenderingContext2D = fgCanvas.getContext("2d")!;


export const backgroundImage = new Image();
backgroundImage.src = "game-assets/Background.png";
backgroundImage.onload = () => {
    bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);
    console.log(backgroundImage)
  };

export const redbull = new Image();
redbull.src = "../game-assets/Redbull.png";
console.log(redbull);
redbull.onload = () => {
    console.log(redbull)
  };