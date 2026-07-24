"use client";

import { useState } from "react";
import type { Member } from "./members";
import { displayName } from "./members";

type DraftMember = Member & { key: string; eligible: boolean };

let nextKey = 0;
const key = () => `roster-${nextKey++}`;

const toDraft = (
  members: Member[],
  excluded: Set<string>,
): DraftMember[] =>
  members.map((member) => ({
    ...member,
    key: key(),
    eligible: !excluded.has(member.name),
  }));

export function RosterEditor({
  members,
  excluded,
  onSave,
  onClose,
}: {
  members: Member[];
  excluded: Set<string>;
  onSave: (members: Member[], excluded: Set<string>) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<DraftMember[]>(() =>
    toDraft(members, excluded),
  );

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  };

  const update = (
    rowKey: string,
    patch: Partial<DraftMember>,
  ) =>
    setRows((current) =>
      current.map((row) => (row.key === rowKey ? { ...row, ...patch } : row)),
    );

  const save = () => {
    const savedMembers = rows.map((row) => ({
      name: row.name,
      nickname: row.nickname,
      image: row.image,
    }));
    const savedExcluded = new Set(
      rows.filter((row) => !row.eligible).map((row) => row.name),
    );
    onSave(savedMembers, savedExcluded);
    onClose();
  };

  return (
    <div className="roster-backdrop" role="presentation">
      <dialog className="roster-editor" open>
        <header>
          <h2>Edit Roster</h2>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="roster-rows">
          {rows.map((row) => (
            <div key={row.key} className="roster-row">
              <input
                type="checkbox"
                checked={row.eligible}
                onChange={(e) =>
                  update(row.key, { eligible: e.target.checked })
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={row.name}
                onChange={(e) => update(row.key, { name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nickname"
                value={row.nickname || ""}
                onChange={(e) =>
                  update(row.key, { nickname: e.target.value })
                }
              />
              <button
                onClick={() =>
                  setRows((current) =>
                    current.filter((r) => r.key !== row.key),
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <footer>
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={save}>
            Save
          </button>
        </footer>
      </dialog>
    </div>
  );
}