// animation.ts

// Denne funktion får en retning som input og ændrer Pac-Man's rotation
export function setPacManDirection(direction: string): void {
  const pacman = document.getElementById("pacman") as HTMLElement;

  switch (direction) {
    case "right":
      pacman.style.transform = "rotate(0deg)"; // Pac-Man kigger mod højre
      break;
    case "left":
      pacman.style.transform = "rotate(180deg)"; // Pac-Man kigger mod venstre
      break;
    case "up":
      pacman.style.transform = "rotate(90deg)"; // Pac-Man kigger op
      break;
    case "down":
      pacman.style.transform = "rotate(-90deg)"; // Pac-Man kigger ned
      break;
    default:
      console.log("Ukendt retning");
  }
}

// animation.ts

// Denne funktion får en retning som input og ændrer en Ghost's rotation
export function setGhostDirection(ghostId: string, direction: string): void {
  const ghost = document.getElementById(ghostId) as HTMLElement;

  switch (direction) {
    case "right":
      ghost.style.transform = "rotate(0deg)"; // Ghost kigger mod højre
      break;
    case "left":
      ghost.style.transform = "rotate(180deg)"; // Ghost kigger mod venstre
      break;
    case "up":
      ghost.style.transform = "rotate(90deg)"; // Ghost kigger op
      break;
    case "down":
      ghost.style.transform = "rotate(-90deg)"; // Ghost kigger ned
      break;
    default:
      console.log("Ukendt retning");
  }
}

export function startPacManMouthAnimation(): void {
  const pacman = document.getElementById("pacman") as HTMLElement;
  if (!pacman) return;

  let frame = 0;
  setInterval(() => {
    frame++;
    pacman.style.backgroundImage =
      frame % 2 === 0
        ? "url('assets/pacman_open.png')"
        : "url('assets/pacman_closed.png')";
  }, 150);
}

export function playPowerUpAnimation(): void {
  const pacman = document.getElementById("pacman") as HTMLElement;
  if (!pacman) return;

  pacman.classList.add("powerup");
  setTimeout(() => {
    pacman.classList.remove("powerup");
  }, 500);
}

//  Idle animation – lille hop-effekt
export function startIdleAnimation(id: string): void {
  const el = document.getElementById(id) as HTMLElement;
  if (!el) return;

  el.classList.add("idle");
}

//  Kill-animation – roter og fade ud
export function playKillAnimation(id: string): void {
  const el = document.getElementById(id) as HTMLElement;
  if (!el) return;

  el.classList.add("killed");

  setTimeout(() => {
    el.classList.remove("killed");
    el.style.opacity = "1"; // reset
    el.style.transform = "rotate(0deg)";
  }, 1000);
}
