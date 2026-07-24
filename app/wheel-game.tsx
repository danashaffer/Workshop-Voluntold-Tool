"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Member } from "./members";
import { displayName } from "./members";
import { selectRandomIndex } from "./selection";
import { PageTextEditor } from "./page-text-editor";
import { Profile } from "./profile";
import { PresentationControl, enterPresentation } from "./presentation-control";
import defaultUiText from "./ui-text.json";

type WheelScreenText = typeof defaultUiText.wheelScreen;

export function WheelGame({
  members,
  copy,
  onBack,
  onCopyChange,
}: {
  members: Member[];
  copy: WheelScreenText;
  onBack: () => void;
  onCopyChange: (copy: typeof defaultUiText) => void;
}) {
  const [winner, setWinner] = useState<Member | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSpin = () => {
    if (isSpinning || members.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const selectedIndex = selectRandomIndex(members.length);
    const winnerMember = members[selectedIndex];

    setTimeout(() => {
      setWinner(winnerMember);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <main className="wheel-screen">
      <div className="wheel-container">
        {!presentation && (
          <button className="game-back" onClick={onBack}>
            {copy.backButton}
          </button>
        )}
        <div className="wheel-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="wheel-canvas"
            width={800}
            height={600}
            onClick={handleSpin}
          />
        </div>
        <div className="wheel-controls">
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={isSpinning || members.length === 0}
          >
            {isSpinning ? copy.spinningButton : copy.spinButton}
          </button>
          {!presentation && (
            <button
              className="copy-edit-dot"
              onClick={() => setEditingText(true)}
              title="Edit text"
            >
              •
            </button>
          )}
          {!presentation && (
            <button
              onClick={() =>
                enterPresentation(
                  setPresentation,
                  (error) => alert(error),
                )
              }
            >
              Present
            </button>
          )}
        </div>
        {winner && !isSpinning && (
          <WinnerCelebration
            winner={winner}
            copy={copy}
            onDismiss={() => setWinner(null)}
          />
        )}
      </div>
      <PresentationControl
        active={presentation}
        onChange={setPresentation}
        onError={(error) => alert(error)}
      />
      {editingText && (
        <PageTextEditor
          heading="Edit wheel screen text"
          value={copy}
          onSave={(updated) => {
            onCopyChange({
              mainMenu: defaultUiText.mainMenu,
              wheelScreen: updated,
            });
            setEditingText(false);
          }}
          onClose={() => setEditingText(false)}
        />
      )}
    </main>
  );
}

function WinnerCelebration({
  winner,
  copy,
  onDismiss,
}: {
  winner: Member;
  copy: WheelScreenText;
  onDismiss: () => void;
}) {
  return (
    <div className="winner-layer" aria-live="assertive">
      <div className="winner-card">
        <p className="winner-banner">{copy.winnerBanner}</p>
        <div className="winner-profile">
          <Profile member={winner} />
        </div>
        <p className="winner-name">{displayName(winner)}</p>
        <button onClick={onDismiss} className="winner-dismiss">
          {copy.dismissWinnerLabel || "Next"}
        </button>
      </div>
    </div>
  );
}