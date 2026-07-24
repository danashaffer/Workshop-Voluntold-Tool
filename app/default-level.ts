import type { Level, LevelObject } from "./level-types";
import { cloneData } from "./platform";

export function cloneLevel(level: Level): Level {
  return cloneData(level);
}

export function createDefaultLevel(): Level {
  return {
    version: 1,
    name: "Simple Course",
    width: 1000,
    height: 2000,
    finishY: 1900,
    start: {
      x: 500,
      y: 200,
      outerRadius: 150,
      innerRadius: 80,
    },
    background: "#73d8ee",
    rails: [
      {
        id: "left-wall",
        ax: 50,
        ay: 0,
        bx: 50,
        by: 2000,
        width: 20,
        color: "#f1f3f8",
      },
      {
        id: "right-wall",
        ax: 950,
        ay: 0,
        bx: 950,
        by: 2000,
        width: 20,
        color: "#f1f3f8",
      },
    ],
    pegs: [
      { id: "peg-1", x: 300, y: 500, radius: 15, color: "#ffd052" },
      { id: "peg-2", x: 700, y: 500, radius: 15, color: "#ffd052" },
      { id: "peg-3", x: 500, y: 800, radius: 15, color: "#ffd052" },
      { id: "peg-4", x: 400, y: 1100, radius: 15, color: "#ffd052" },
      { id: "peg-5", x: 600, y: 1100, radius: 15, color: "#ffd052" },
    ],
    spinners: [],
    cannons: [],
    labels: [
      { id: "start-label", x: 500, y: 100, text: "START" },
      { id: "finish-label", x: 500, y: 1950, text: "FINISH" },
    ],
  };
}