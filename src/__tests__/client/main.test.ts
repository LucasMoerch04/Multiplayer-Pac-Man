// Mock document.getElementById for canvases
const fakeCtx = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
};
const mockCanvas = {
  width: 10,
  height: 10,
  getContext: jest.fn().mockReturnValue(fakeCtx),
};
Object.defineProperty(global.document, "getElementById", {
  value: jest.fn().mockReturnValue(mockCanvas),
});

// Mock socket.io-client
const socketHandlers: Record<string, Function> = {};
const emitSpy = jest.fn();
jest.mock("socket.io-client", () => ({
  io: () => ({
    on: (evt: string, cb: Function) => {
      socketHandlers[evt] = cb;
    },
    emit: emitSpy,
    id: "test-socket-id",
  }),
}));

// Stub non-JS imports (CSS)
jest.mock("../../client/style.css", () => ({}));
// Provide an empty collisions array so CollisionBlocks.ts can import it safely
jest.mock("../../client/Collisionstext", () => ({
  collisions: [] as number[],
}));

//Mock shared entities & Powers module
jest.mock("../../shared/entities", () => ({
  SPlayer: jest.fn().mockImplementation((x, y, color, speed) => ({
    x,
    y,
    color,
    speed,
    draw: jest.fn(),
    checkCollision: jest.fn().mockReturnValue(false),
    checkCollisionWithPacman: jest.fn().mockReturnValue(false),
  })),
  Pacman: jest.fn().mockImplementation((x, y, tag, speed) => ({
    x,
    y,
    tag,
    speed,
    draw: jest.fn(),
  })),
}));
jest.mock("../../client/Powers", () => ({
  SpeedObjectCollision: jest.fn().mockReturnValue(null),
  teleportObjectCollision: jest.fn().mockReturnValue(null),
  cherryObjectCollision: jest.fn().mockReturnValue(-1),
  speedObjects: [{ draw: jest.fn() }],
  cherryObjects: [{ draw: jest.fn() }],
}));

import "../../client/main";
import { animate } from "../../client/main";
import { fgCtx } from "../../client/Canvas";
import * as Powers from "../../client/Powers";
import { frontEndPlayers, frontEndPacMan } from "../../client/main";

describe("main.ts socket handlers & animate()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
        <h1 id="userCounter">Users Connected: 0</h1>
        <canvas id="gameState" width="10" height="10"></canvas>
        <canvas id="gameCanvas" width="10" height="10"></canvas>
      `;
  });

  it("updateCounter updates #userCounter text", () => {
    socketHandlers["updateCounter"]({ countUsers: 7 });
    expect(document.getElementById("userCounter")!.innerText).toBe(
      "Users Connected: 7",
    );
  });

  it("updatePacMan sets local Pacman position", () => {
    socketHandlers["updatePacMan"]({ x: 100, y: 200 });
    const pac = frontEndPacMan[0];
    expect(pac.x).toBe(100);
    expect(pac.y).toBe(200);
  });

  it("updatePlayers adds and removes a remote player", () => {
    socketHandlers["updatePlayers"]({
      foo: { x: 1, y: 2, color: "blue", speed: 3 },
    });
    expect(frontEndPlayers.foo).toBeDefined();
    expect(frontEndPlayers.foo.x).toBe(1);

    socketHandlers["updatePlayers"]({});
    expect(frontEndPlayers.foo).toBeUndefined();
  });

  it("animate clears canvas and calls draw on entities and power-ups", () => {
    // ensure at least one player exists
    if (Object.keys(frontEndPlayers).length === 0) {
      const { SPlayer } = require("../../shared/entities");
      frontEndPlayers["bar"] = new SPlayer(5, 5, "red", 2);
    }
    animate();
    expect(fgCtx.clearRect as jest.Mock).toHaveBeenCalled();
    expect(frontEndPacMan[0].draw as jest.Mock).toHaveBeenCalled();

    const somePlayer = frontEndPlayers[Object.keys(frontEndPlayers)[0]];
    expect(somePlayer.draw as jest.Mock).toHaveBeenCalled();

    expect(Powers.speedObjects[0].draw as jest.Mock).toHaveBeenCalled();
    expect(Powers.cherryObjects[0].draw as jest.Mock).toHaveBeenCalled();
  });
});
