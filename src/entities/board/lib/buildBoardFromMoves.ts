import type { Move, Player } from "../model/types";
import { keyOf } from "./key";

type ReplayMove = Pick<Move, "x" | "y" | "player">;

type BuildBoardResult = {
  board: Map<string, Player>;
  lastMove?: { x: number; y: number };
};

export const buildBoardFromMoves = (
  moves: ReplayMove[],
  upTo: number
): BuildBoardResult => {
  const board = new Map<string, Player>();
  const safeUpTo = Math.max(0, Math.min(upTo, moves.length));

  for (let i = 0; i < safeUpTo; i += 1) {
    const move = moves[i];
    board.set(keyOf(move.x, move.y), move.player);
  }

  const last = safeUpTo > 0 ? moves[safeUpTo - 1] : undefined;

  return {
    board,
    lastMove: last ? { x: last.x, y: last.y } : undefined,
  };
};
