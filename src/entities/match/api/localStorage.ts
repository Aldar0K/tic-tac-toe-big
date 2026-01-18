import type { Match } from "../model/types";

export const MATCHES_KEY = "amicon_ttt_matches_v1";

const sortMatches = (matches: Match[]): Match[] =>
  [...matches].sort((a, b) => b.createdAt - a.createdAt);

const safeParseMatches = (raw: string | null): Match[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sortMatches(parsed as Match[]);
  } catch {
    return [];
  }
};

export const loadMatches = (): Match[] => {
  if (typeof localStorage === "undefined") return [];
  return safeParseMatches(localStorage.getItem(MATCHES_KEY));
};

export const saveMatches = (matches: Match[]): void => {
  if (typeof localStorage === "undefined") return;
  const sorted = sortMatches(matches);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(sorted));
};

export const addMatch = (match: Match): void => {
  const matches = loadMatches().filter((item) => item.id !== match.id);
  saveMatches([match, ...matches]);
};

export const updateMatch = (match: Match): void => {
  const matches = loadMatches();
  const idx = matches.findIndex((item) => item.id === match.id);
  if (idx === -1) return;
  const next = [...matches];
  next[idx] = match;
  saveMatches(next);
};

export const getMatchById = (id: string): Match | null => {
  const matches = loadMatches();
  return matches.find((item) => item.id === id) ?? null;
};
