"use client";

import { useState, type CSSProperties } from "react";
import type { Member } from "./members";
import { PageTextEditor } from "./page-text-editor";
import { RosterEditor } from "./roster-editor";
import defaultUiText from "./ui-text.json";

type GameId = "wheel" | "marbles";
type MainMenuText = typeof defaultUiText.mainMenu;

export function GameLobby({
  members,
  excluded,
  copy,
  presentation,
  onPresentation,
  onCopyChange,
  onSelect,
  onRosterChange,
}: {
  members: Member[];
  excluded: Set<string>;
  copy: MainMenuText;
  presentation: boolean;
  onPresentation: (active: boolean) => void;
  onCopyChange: (copy: typeof defaultUiText) => void;
  onSelect: (game: GameId) => void;
  onRosterChange: (members: Member[], excluded: Set<string>) => void;
}) {
  const [editingRoster, setEditingRoster] = useState(false);
  const [editingText, setEditingText] = useState(false);
  const eligibleCount = members.filter((m) => !excluded.has(m.name)).length;

  return (
    <main className="game-room">
      <div className="room-shell">
        <header className="room-hero">
          <p className="room-eyebrow">
            {!presentation && (
              <button
                className="copy-edit-dot"
                onClick={() => setEditingText(true)}
                title="Edit menu text"
              >
                •
              </button>
            )}
            {copy.eyebrow}
          </p>
          <h1>
            <span>{copy.titleFirstLine}</span>
            <span>{copy.titleSecondLine}</span>
          </h1>
          <p className="room-subtitle">{copy.subtitle}</p>
          {!presentation && eligibleCount > 0 && (
            <button
              className="edit-roster-button"
              onClick={() => setEditingRoster(true)}
            >
              {copy.editRosterButton}
            </button>
          )}
        </header>
        <div className="room-cards">
          <GameCard
            id="wheel"
            accent="#388ce8"
            kicker={copy.wheel.kicker}
            name={copy.wheel.name}
            action={copy.wheel.action}
            onSelect={onSelect}
            disabled={eligibleCount === 0}
          />
          <GameCard
            id="marbles"
            accent="#25bfb1"
            kicker={copy.marbles.kicker}
            name={copy.marbles.name}
            action={copy.marbles.action}
            onSelect={onSelect}
            disabled={eligibleCount === 0}
          />
        </div>
        <footer className="room-footer">
          <label>
            <input
              type="checkbox"
              checked={presentation}
              onChange={(e) => onPresentation(e.target.checked)}
            />
            Presentation Mode
          </label>
        </footer>
      </div>
      {editingRoster && (
        <RosterEditor
          members={members}
          excluded={excluded}
          onSave={onRosterChange}
          onClose={() => setEditingRoster(false)}
        />
      )}
      {editingText && (
        <PageTextEditor
          heading="Edit menu text"
          value={copy}
          onSave={(updated) => {
            onCopyChange({
              mainMenu: updated,
              wheelScreen: defaultUiText.wheelScreen,
            });
            setEditingText(false);
          }}
          onClose={() => setEditingText(false)}
        />
      )}
    </main>
  );
}

function GameCard({
  id,
  accent,
  kicker,
  name,
  action,
  onSelect,
  disabled,
}: {
  id: GameId;
  accent: string;
  kicker: string;
  name: string;
  action: string;
  onSelect: (game: GameId) => void;
  disabled: boolean;
}) {
  return (
    <button
      className={`game-card game-card-${id}`}
      onClick={() => onSelect(id)}
      disabled={disabled}
      style={{ "--game-accent": accent } as CSSProperties}
    >
      <span className="game-card-art" aria-hidden="true" />
      <div className="game-card-text">
        <p className="game-card-kicker">{kicker}</p>
        <h2 className="game-card-name">{name}</h2>
        <p className="game-card-action">{action}</p>
      </div>
    </button>
  );
}