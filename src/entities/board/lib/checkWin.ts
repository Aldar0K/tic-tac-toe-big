import { WIN_LEN } from "@/shared/config/game";
import type { BoardMap, Move, Player } from "../model/types";
import { keyOf } from "./key";

type LinePoint = { x: number; y: number };

type WinResult = {
  winner: Player | null;
  line: LinePoint[];
};

export const checkWinFromLastMove = (
  board: BoardMap,
  lastMove: Move,
  winLen = WIN_LEN
): WinResult => {
  const { x, y, player } = lastMove;
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
  ];

  for (const { dx, dy } of directions) {
    let neg = 0;
    let pos = 0;

    for (let step = 1; step < winLen; step += 1) {
      const key = keyOf(x - dx * step, y - dy * step);
      if (board.get(key) !== player) break;
      neg += 1;
    }

    for (let step = 1; step < winLen; step += 1) {
      const key = keyOf(x + dx * step, y + dy * step);
      if (board.get(key) !== player) break;
      pos += 1;
    }

    if (neg + pos + 1 >= winLen) {
      const startOffset = -neg;
      const line: LinePoint[] = [];

      for (let i = 0; i < winLen; i += 1) {
        const offset = startOffset + i;
        line.push({ x: x + dx * offset, y: y + dy * offset });
      }

      return { winner: player, line };
    }
  }

  return { winner: null, line: [] };
};
