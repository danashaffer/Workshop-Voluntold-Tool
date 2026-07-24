type RandomSource = () => number;

export interface Member {
  name: string;
  nickname?: string;
  image?: string;
}

export interface ParsedRoster {
  members: Member[];
  excluded: Set<string>;
}

export function displayName(member: Member) {
  return member.nickname || member.name;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export const PLACEHOLDER_PORTRAITS = [
  "/portraits/avatar-coral.svg",
  "/portraits/avatar-blue.svg",
  "/portraits/avatar-gold.svg",
  "/portraits/avatar-green.svg",
  "/portraits/avatar-purple.svg",
  "/portraits/avatar-teal.svg",
];

export const RANDOM_NAME_PARTS = [
  "Abbott", "Ada", "Aden", "Adrian", "Alyssa", "Amber", "Amos", "Amy",
  "Andrea", "Angel", "Angelina", "Anita", "Ann", "Anna", "Anne", "Annette",
  "April", "Archie", "Arden", "Ariana", "Ariel", "Arron", "Arthur", "Artur",
  "Ashcraft", "Asher", "Ashley", "Athena", "Atlas", "Atticus", "Aubrey", "Audio",
  "Audit", "Augusta", "Augustus", "Aurora", "Aurore", "Austin", "Autumn", "Aveline",
  "Avery", "Avisha", "Axel", "Axelle", "Bailey", "Baird", "Banyan", "Barb",
  "Barbara", "Bardolph", "Barkley", "Barlow", "Barnaby", "Barnes", "Barnum", "Baron",
  "Barr", "Barrett", "Barric", "Barrios", "Barron", "Barrows", "Barry", "Bart",
  "Barth", "Barthel", "Bartholomew", "Bartlett", "Barton", "Baruch", "Bascom", "Basie",
  "Basil", "Basilica", "Basilio", "Basin", "Basket", "Baskett", "Bass", "Bassett",
  "Bassi", "Bassie", "Bastien", "Bastion", "Batchelor", "Batchelder", "Bate", "Bates",
  "Bath", "Bathe", "Bathilda", "Bathsheba", "Batista", "Batley", "Batson", "Battaglia",
  "Battalini", "Battelle", "Battenbacher", "Battersby", "Batterton", "Batterson",
  "Battle", "Battlefield", "Battley", "Battrum", "Batts", "Battson", "Battucci",
  "Baty", "Batzer", "Baud", "Baude", "Baudette", "Bauer", "Baugh", "Baughan",
  "Baughman", "Baughton", "Baugier", "Baum", "Bauman", "Baumbach", "Baumann",
  "Baumert", "Baumgarten", "Baumgartner", "Baumgarts", "Baumgert", "Baummann",
];

export function createRandomMember(
  existing: Member[],
  random: RandomSource,
): Member {
  const existingNames = new Set(existing.map((m) => m.name));
  let name: string;
  let attempts = 0;
  do {
    const given = RANDOM_NAME_PARTS[Math.floor(random() * RANDOM_NAME_PARTS.length)];
    let family = RANDOM_NAME_PARTS[Math.floor(random() * RANDOM_NAME_PARTS.length)];
    while (family === given && RANDOM_NAME_PARTS.length > 1) {
      family = RANDOM_NAME_PARTS[Math.floor(random() * RANDOM_NAME_PARTS.length)];
    }
    name = `${given} ${family}`;
    attempts += 1;
  } while (existingNames.has(name) && attempts < 100);
  
  return {
    name,
    image: PLACEHOLDER_PORTRAITS[Math.floor(random() * PLACEHOLDER_PORTRAITS.length)],
  };
}

export function parseRoster(input: string): Member[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Roster must be valid JSON.");
  }
  return Array.isArray(parsed)
    ? parsed.map((item) =>
        typeof item === "string"
          ? { name: item }
          : { name: (item as { name: string }).name },
      )
    : parseRosterDocument(input).members;
}

export function parseRosterDocument(input: string): ParsedRoster {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Roster must be valid JSON.");
  }

  const record = parsed as Record<string, unknown>;
  const version = typeof record.version === "number" ? record.version : 1;

  if (version !== 1) {
    throw new Error(`Roster version ${version} is not supported.`);
  }

  const membersInput = Array.isArray(record.members) ? record.members : [];
  
  if (membersInput.length === 0) {
    throw new Error("Roster must have at least one member.");
  }
  
  if (membersInput.length > 100) {
    throw new Error("Rosters are limited to up to 100 members.");
  }

  const members: Member[] = [];
  const names = new Set<string>();

  for (const item of membersInput) {
    const m = item as Record<string, unknown>;
    const name = String(m.name || "").trim();
    
    if (!name) {
      throw new Error("Each member must have a name.");
    }
    
    const nameLower = name.toLowerCase();
    if (names.has(nameLower)) {
      throw new Error(`Duplicate name: ${name}`);
    }
    
    names.add(nameLower);
    members.push({
      name,
      nickname: typeof m.nickname === "string" ? m.nickname : undefined,
      image: typeof m.image === "string" ? m.image : undefined,
    });
  }

  const excluded = new Set<string>();
  const excludedInput = record.members as Array<Record<string, unknown>>;
  for (let i = 0; i < excludedInput.length; i++) {
    if (excludedInput[i]?.eligible === false) {
      excluded.add(members[i]!.name);
    }
  }

  return { members, excluded };
}

export function serializeRoster(
  members: Member[],
  excluded: Set<string>,
): string {
  return JSON.stringify(
    {
      version: 1,
      members: members.map((m) => ({
        ...m,
        eligible: !excluded.has(m.name),
      })),
    },
    null,
    2,
  );
}

export function buildRaceRoster(members: Member[], count: number): Member[] {
  const result = [...members];
  let index = 1;
  while (result.length < count) {
    result.push({ name: `Test Marble ${index}` });
    index += 1;
  }
  return result.slice(0, count);
}