// background canvas
export const bgCanvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas",
) as HTMLCanvasElement;
export const bgCtx: CanvasRenderingContext2D = bgCanvas.getContext("2d")!;

// foreground canvas
export const fgCanvas: HTMLCanvasElement = document.getElementById(
  "gameState",
) as HTMLCanvasElement;
export const fgCtx: CanvasRenderingContext2D = fgCanvas.getContext("2d")!;

export const canvasHeight = bgCanvas.height;
export const canvasWidth = bgCanvas.width;

export const backgroundImage = new Image();
backgroundImage.src = "game-assets/Background.png";
backgroundImage.onload = () => {
  bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);
  console.log(backgroundImage);
};

export const redbullImage = new Image();
redbullImage.src = "game-assets/Redbull.png";
redbullImage.onload = () => {
  console.log(redbullImage);
};

export const cherryImage = new Image();
cherryImage.src = "../game-assets/Cherry.png";
cherryImage.onload = () => {
  console.log(cherryImage);
};

export function drawBackground() {
  bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);
}
