import { useState } from "react";
import {
  checkWinFromLastMove,
  keyOf,
  type BoardMap,
  type Move,
  type Player,
} from "@/entities/board";
import {
  addMatch,
  getMatchById,
  updateMatch,
  type Match,
  type MatchId,
} from "@/entities/match";

type UseGameParams = {
  xName: string;
  oName: string;
  winLen?: number;
};

type MakeMoveResult = { ok: boolean; reason?: "occupied" | "finished" };

const createMatchId = (): MatchId => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

export const useGame = ({ xName, oName, winLen = 5 }: UseGameParams) => {
  const [board, setBoard] = useState<BoardMap>(() => new Map());
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winLine, setWinLine] = useState<Array<{ x: number; y: number }>>([]);
  const [matchId, setMatchId] = useState<MatchId>(() => createMatchId());
  const [createdAt, setCreatedAt] = useState<number>(() => Date.now());
  const [isPersisted, setIsPersisted] = useState(false);

  const makeMove = (x: number, y: number): MakeMoveResult => {
    if (winner) return { ok: false, reason: "finished" };
    const key = keyOf(x, y);
    if (board.has(key)) return { ok: false, reason: "occupied" };

    const move: Move = { x, y, player: currentPlayer, at: Date.now() };
    const nextBoard = new Map(board);
    nextBoard.set(key, currentPlayer);
    const nextMoves = [...moves, move];

    setBoard(nextBoard);
    setMoves(nextMoves);

    const result = checkWinFromLastMove(nextBoard, move, winLen);
    if (result.winner) {
      setWinner(result.winner);
      setWinLine(result.line);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }

    return { ok: true };
  };

  const reset = () => {
    setBoard(new Map());
    setMoves([]);
    setCurrentPlayer("X");
    setWinner(null);
    setWinLine([]);
    setMatchId(createMatchId());
    setCreatedAt(Date.now());
    setIsPersisted(false);
  };

  const finishAndPersist = () => {
    if (isPersisted) return;
    const match: Match = {
      id: matchId,
      players: { xName, oName },
      createdAt,
      finishedAt: Date.now(),
      winner,
      winLine,
      moves: moves.map((move) => ({
        x: move.x,
        y: move.y,
        player: move.player,
        at: move.at ?? Date.now(),
      })),
    };

    if (getMatchById(matchId)) {
      updateMatch(match);
    } else {
      addMatch(match);
    }
    setIsPersisted(true);
  };

  return {
    board,
    moves,
    currentPlayer,
    winner,
    winLine,
    isPersisted,
    makeMove,
    reset,
    finishAndPersist,
  };
};
