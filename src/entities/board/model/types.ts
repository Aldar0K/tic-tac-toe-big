export type Player = "X" | "O";

export type Move = {
  x: number;
  y: number;
  player: Player;
  at?: number;
};

export type BoardMap = Map<string, Player>;
