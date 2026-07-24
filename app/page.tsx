"use client";

import { useEffect, useRef, useState } from "react";
import type { Level } from "./level-types";
import type { Member, ParsedRoster } from "./members";
import { GameLobby } from "./game-lobby";
import { WheelGame } from "./wheel-game";
import { RaceGame } from "./race-game";
import { LevelEditor } from "./level-editor";
import { createDefaultLevel } from "./default-level";
import { createDefaultRoster } from "./default-roster";
import { readLocalJson, writeLocalJson } from "./storage";
import defaultUiText from "./ui-text.json";

type GameId = "wheel" | "marbles" | "editor";

export function mergeUiText(partial: Partial<typeof defaultUiText>) {
  return {
    mainMenu: { ...defaultUiText.mainMenu, ...partial.mainMenu },
    wheelScreen: { ...defaultUiText.wheelScreen, ...partial.wheelScreen },
  };
}

export default function Home() {
  const [screen, setScreen] = useState<GameId | "lobby">("lobby");
  const [members, setMembers] = useState<Member[]>([]);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState<Level | null>(null);
  const [presentation, setPresentation] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [uiText, setUiText] = useState(defaultUiText);
  const loadingRef = useRef(true);

  // Load persisted data on mount
  useEffect(() => {
    if (!loadingRef.current) return;
    loadingRef.current = false;

    const rosterResult = readLocalJson<ParsedRoster>("chance-arcade-roster-v1");
    if (rosterResult.value) {
      setMembers(rosterResult.value.members);
      setExcluded(rosterResult.value.excluded);
    } else {
      setMembers(createDefaultRoster());
    }

    const levelResult = readLocalJson<Level>("chance-arcade-level-v1");
    if (levelResult.value) {
      setLevel(levelResult.value);
    } else {
      setLevel(createDefaultLevel());
    }

    const uiResult = readLocalJson<typeof defaultUiText>("chance-arcade-ui-text-v1");
    if (uiResult.value) {
      setUiText(mergeUiText(uiResult.value));
    }
  }, []);

  const handleRosterChange = (newMembers: Member[], newExcluded: Set<string>) => {
    setMembers(newMembers);
    setExcluded(newExcluded);
    const error = writeLocalJson("chance-arcade-roster-v1", {
      version: 1,
      members: newMembers,
      excluded: Array.from(newExcluded),
    });
    if (error) setNotice(error);
  };

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel);
    const error = writeLocalJson("chance-arcade-level-v1", newLevel);
    if (error) setNotice(error);
  };

  const handleUiTextChange = (newText: typeof defaultUiText) => {
    setUiText(newText);
    const error = writeLocalJson("chance-arcade-ui-text-v1", newText);
    if (error) setNotice(error);
  };

  const returnToLobby = () => {
    setScreen("lobby");
  };

  const eligibleMembers = members.filter((m) => !excluded.has(m.name));

  return (
    <div className={`app ${presentation ? "is-presenting" : ""}`}>
      {screen === "lobby" && (
        <GameLobby
          members={members}
          excluded={excluded}
          copy={uiText.mainMenu}
          presentation={presentation}
          onPresentation={setPresentation}
          onCopyChange={handleUiTextChange}
          onSelect={(game) => setScreen(game)}
          onRosterChange={handleRosterChange}
        />
      )}
      {screen === "wheel" && (
        <WheelGame
          members={eligibleMembers}
          copy={uiText.wheelScreen}
          onBack={returnToLobby}
          onCopyChange={handleUiTextChange}
        />
      )}
      {screen === "marbles" && level && (
        <RaceGame
          level={level}
          members={eligibleMembers}
          onBack={returnToLobby}
          onEdit={() => setScreen("editor")}
        />
      )}
      {screen === "editor" && level && (
        <LevelEditor
          level={level}
          members={members}
          excluded={excluded}
          onLevelChange={handleLevelChange}
          onRosterChange={handleRosterChange}
          onBack={returnToLobby}
        />
      )}
      {notice && (
        <div className="app-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
    </div>
  );
}