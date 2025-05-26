import { bgCanvas, fgCanvas } from "./Canvas";
import { socket } from "./main";

const startButton = document.getElementById("startButton") as HTMLButtonElement;
startButton.addEventListener("click", () => {
  socket.emit("startGame");
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
