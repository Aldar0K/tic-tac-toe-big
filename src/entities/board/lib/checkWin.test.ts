import { describe, expect, it } from "vitest";
import {
  checkWinFromLastMove,
  keyOf,
  type BoardMap,
  type Move,
} from "../index";

const makeBoard = (moves: Move[]): BoardMap => {
  const board: BoardMap = new Map();
  for (const move of moves) {
    board.set(keyOf(move.x, move.y), move.player);
  }
  return board;
};

const expectWin = (result: ReturnType<typeof checkWinFromLastMove>) => {
  expect(result.winner).toBeTruthy();
  expect(result.line).toHaveLength(5);
};

describe("checkWinFromLastMove", () => {
  it("detects horizontal 5", () => {
    const moves: Move[] = Array.from({ length: 5 }, (_, idx) => ({
      x: idx,
      y: 3,
      player: "X",
    }));
    const board = makeBoard(moves);
    const result = checkWinFromLastMove(board, moves[4]);

    expectWin(result);
    expect(result.line).toEqual([
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ]);
  });

  it("detects vertical 5", () => {
    const moves: Move[] = Array.from({ length: 5 }, (_, idx) => ({
      x: -2,
      y: idx,
      player: "O",
    }));
    const board = makeBoard(moves);
    const result = checkWinFromLastMove(board, moves[4]);

    expectWin(result);
    expect(result.line).toEqual([
      { x: -2, y: 0 },
      { x: -2, y: 1 },
      { x: -2, y: 2 },
      { x: -2, y: 3 },
      { x: -2, y: 4 },
    ]);
  });

  it("detects diagonal \\ 5", () => {
    const moves: Move[] = Array.from({ length: 5 }, (_, idx) => ({
      x: idx,
      y: idx,
      player: "X",
    }));
    const board = makeBoard(moves);
    const result = checkWinFromLastMove(board, moves[4]);

    expectWin(result);
    expect(result.line).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
    ]);
  });

  it("detects diagonal / 5", () => {
    const moves: Move[] = Array.from({ length: 5 }, (_, idx) => ({
      x: idx,
      y: 4 - idx,
      player: "O",
    }));
    const board = makeBoard(moves);
    const result = checkWinFromLastMove(board, moves[4]);

    expectWin(result);
    expect(result.line).toEqual([
      { x: 0, y: 4 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 0 },
    ]);
  });

  it("returns win on length 6 with line length 5 containing lastMove", () => {
    const moves: Move[] = Array.from({ length: 6 }, (_, idx) => ({
      x: idx,
      y: 1,
      player: "X",
    }));
    const board = makeBoard(moves);
    const lastMove = moves[5];
    const result = checkWinFromLastMove(board, lastMove);

    expectWin(result);
    expect(result.line).toHaveLength(5);
    expect(result.line).toContainEqual({ x: lastMove.x, y: lastMove.y });
  });

  it("returns no win when there are fewer than 5 in a row", () => {
    const moves: Move[] = Array.from({ length: 4 }, (_, idx) => ({
      x: idx,
      y: 0,
      player: "O",
    }));
    const board = makeBoard(moves);
    const result = checkWinFromLastMove(board, moves[3]);

    expect(result.winner).toBeNull();
    expect(result.line).toEqual([]);
  });
});
