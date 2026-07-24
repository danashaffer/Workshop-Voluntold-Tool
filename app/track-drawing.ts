import type { Rail, Level, Peg, Spinner, Cannon, RuntimeTrack } from "./level-types";
import type { Ball } from "./physics";
import type { Member } from "./members";

interface Viewport {
  top: number;
  bottom: number;
}

const isVisible = (
  y: number,
  radius: number,
  viewport?: Viewport,
) =>
  !viewport ||
  (y + radius >= viewport.top && y - radius <= viewport.bottom);

export function drawBackground(
  context: CanvasRenderingContext2D,
  level: Level,
  cameraY: number,
  viewHeight: number,
) {
  context.fillStyle = level.background || "#73d8ee";
  context.fillRect(0, 0, level.width, level.height);
}

export function drawTrack(
  context: CanvasRenderingContext2D,
  track: RuntimeTrack,
  elapsed: number,
  time?: number,
  viewport?: Viewport,
) {
  // Draw rails
  for (const rail of track.rails) {
    if (!isVisible(Math.max(rail.ay, rail.by), rail.width / 2, viewport)) {
      continue;
    }
    context.strokeStyle = rail.color;
    context.lineWidth = rail.width;
    context.beginPath();
    context.moveTo(rail.ax, rail.ay);
    context.lineTo(rail.bx, rail.by);
    context.stroke();
  }

  // Draw pegs
  for (const peg of track.pegs) {
    if (!isVisible(peg.y, peg.radius, viewport)) continue;
    context.fillStyle = peg.color;
    context.beginPath();
    context.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
    context.fill();
  }
}

export function drawBall(
  context: CanvasRenderingContext2D,
  ball: Ball,
  member: Member,
  color: string,
  portrait?: HTMLImageElement,
  waiting = false,
) {
  context.save();
  context.translate(ball.x, ball.y);
  if (!waiting) context.rotate(ball.angle);
  context.fillStyle = color;
  context.beginPath();
  context.arc(0, 0, 16, 0, Math.PI * 2);
  context.fill();
  if (portrait) {
    context.drawImage(portrait, -12, -12, 24, 24);
  }
  context.restore();
}