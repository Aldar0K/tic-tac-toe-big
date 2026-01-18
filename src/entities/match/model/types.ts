export type MatchId = string;

export type Match = {
  id: MatchId;
  players: { xName: string; oName: string };
  createdAt: number;
  finishedAt: number | null;
  winner: "X" | "O" | null;
  winLine: Array<{ x: number; y: number }>;
  moves: Array<{ x: number; y: number; player: "X" | "O"; at: number }>;
};
