import { bgCanvas, drawBackground, fgCanvas } from "./Canvas";
import { animate, socket } from "./main";

const startButton = document.getElementById("startButton") as HTMLButtonElement;
console.log("Start button:", startButton);
startButton.addEventListener("click", () => {
  socket.emit("startGame");
  console.log("Start button clicked");
});

// Set up the canvases
export function initializeCanvases() {
  hideMenu();
}

function showMenu() {
  document.getElementById("namesquare")!.style.display = "block";
  fgCanvas.style.display = "block";
  bgCanvas.style.display = "block";
}

function hideMenu() {
  document.getElementById("menu")!.style.display = "none";
}

showMenu();
