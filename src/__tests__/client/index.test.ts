import { describe, it, expect } from "@jest/globals";

describe("index.html", () => {
  it('should contain a canvas element with id "gameCanvas"', () => {
    const canvas = document.querySelector("#gameCanvas");
    expect(canvas).toBeDefined();
  });
  it('should contain a canvas element with id "gameState"', () => {
    const canvas = document.querySelector("#gameState");
    expect(canvas).toBeDefined();
  });
});
