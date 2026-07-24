export function createDefaultRoster() {
  return [
    { name: "Alex North", nickname: "Alex", image: "/portraits/avatar-coral.svg" },
    { name: "Casey River", nickname: "Casey", image: "/portraits/avatar-blue.svg" },
    { name: "Drew Harbor", nickname: "Drew", image: "/portraits/avatar-gold.svg" },
    { name: "Jordan Vale", nickname: "Jordan", image: "/portraits/avatar-green.svg" },
    { name: "Morgan Pine", nickname: "Morgan", image: "/portraits/avatar-purple.svg" },
    { name: "Riley Stone", nickname: "Riley", image: "/portraits/avatar-teal.svg" },
  ];
}

export function createDefaultRosterDocument() {
  return {
    members: createDefaultRoster(),
    excluded: new Set<string>(),
  };
}