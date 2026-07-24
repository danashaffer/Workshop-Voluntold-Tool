"use client";

import { useEffect, useRef, useState } from "react";
import type { Level } from "./level-types";
import type { Member } from "./members";
import { displayName } from "./members";
import {
  createBalls,
  createRuntimeTrack,
  positionWaitingBalls,
  releaseWaitingBalls,
  stepPhysics,
} from "./physics";
import { drawBackground, drawBall, drawTrack } from "./track-drawing";
import { Profile } from "./profile";

export const WINNER_TOAST_HOLD_MS = 5000;
export const WINNER_TOAST_EXIT_MS = 450;

export function RaceGame({
  level,
  members,
  onBack,
  onEdit,
}: {
  level: Level;
  members: Member[];
  onBack: () => void;
  onEdit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [standings, setStandings] = useState<Member[]>([]);
  const [winner, setWinner] = useState<Member | null>(null);
  const [showWinnerToast, setShowWinnerToast] = useState(false);
  const [winnerToastExiting, setWinnerToastExiting] = useState(false);

  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const balls = createBalls(Math.min(members.length, 100), level);
    const track = createRuntimeTrack(level);
    positionWaitingBalls(balls, level, 1.75);
    releaseWaitingBalls(balls, level);

    let frameId: number;
    let lastStandingsUpdate = 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      // Step physics
      const deltaTime = 1 / 120;
      stepPhysics(balls, track, deltaTime, elapsed);

      // Update standings periodically
      if (now - lastStandingsUpdate > 140) {
        setStandings(
          balls
            .filter((b) => b.finished)
            .sort((a, b) => a.finishTime - b.finishTime)
            .slice(0, 6)
            .map((b) => members[b.memberIndex]),
        );
        lastStandingsUpdate = now;
      }

      // Check for winner
      const finishedBalls = balls.filter((b) => b.finished);
      if (finishedBalls.length > 0 && !winner) {
        const winnerBall = finishedBalls[0];
        const winnerMember = members[winnerBall.memberIndex];
        setWinner(winnerMember);
        setShowWinnerToast(true);

        setTimeout(() => {
          setWinnerToastExiting(true);
          setTimeout(() => {
            setShowWinnerToast(false);
            setWinnerToastExiting(false);
          }, WINNER_TOAST_EXIT_MS);
        }, WINNER_TOAST_HOLD_MS);
      }

      // Draw
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          drawBackground(ctx, level, 0, canvas.height);
          drawTrack(ctx, track, elapsed);
          for (const ball of balls) {
            if (!ball.finished) {
              drawBall(
                ctx,
                ball,
                members[ball.memberIndex],
                "#0066cc",
              );
            }
          }
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    startRef.current = () => {
      cancelAnimationFrame(frameId);
    };

    return () => cancelAnimationFrame(frameId);
  }, [level, members, winner]);

  return (
    <main className="race-screen">
      <div className="race-container">
        <button className="game-back" onClick={onBack}>
          Back
        </button>
        <canvas ref={canvasRef} className="race-canvas" width={1000} height={800} />
        <div className="standings">
          <h3>Standings</h3>
          <ol>
            {standings.map((member, idx) => (
              <li key={idx}>
                <Profile member={member} />
                <span>{displayName(member)}</span>
              </li>
            ))}
          </ol>
        </div>
        {winner && showWinnerToast && (
          <aside
            className={`winner-toast ${winnerToastExiting ? "is-exiting" : ""}`}
            aria-live="polite"
          >
            <button
              onClick={() => setShowWinnerToast(false)}
              aria-label="Dismiss winner"
            >
              ✓
            </button>
            <Profile member={winner} />
            <span>{displayName(winner)} wins!</span>
          </aside>
        )}
      </div>
    </main>
  );
}

const wait = (milliseconds: number) => 
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export const formatTime = (seconds: number) => 
  `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(2).padStart(5, "0")}`;
