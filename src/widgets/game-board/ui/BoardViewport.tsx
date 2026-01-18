import { useMemo } from "react";
import { keyOf } from "@/entities/board";
import { useCamera } from "@/widgets/game-board/model/useCamera";

type BoardViewportProps = {
  board: Map<string, "X" | "O">;
  lastMove?: { x: number; y: number };
  winLine?: Array<{ x: number; y: number }>;
  onCellClick: (x: number, y: number) => void;
  gridSize?: number;
  cellSize?: number;
};

// Example: <BoardViewport board={board} onCellClick={(x, y) => makeMove(x, y)} />
export const BoardViewport = ({
  board,
  lastMove,
  winLine,
  onCellClick,
  gridSize,
  cellSize,
}: BoardViewportProps) => {
  const { startX, startY, gridSize: size, cellSize: cell, bind } = useCamera({
    gridSize,
    cellSize,
  });

  const rows = useMemo(() => Array.from({ length: size }, (_, i) => i), [size]);
  const cols = useMemo(() => Array.from({ length: size }, (_, i) => i), [size]);
  const winKeys = useMemo(() => {
    if (!winLine) return new Set<string>();
    return new Set(winLine.map((point) => keyOf(point.x, point.y)));
  }, [winLine]);
  const lastKey = useMemo(
    () => (lastMove ? keyOf(lastMove.x, lastMove.y) : null),
    [lastMove]
  );

  return (
    <div
      className="inline-block overflow-hidden select-none touch-none"
      style={{ width: size * cell, height: size * cell }}
      {...bind}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cell}px)`,
          gridTemplateRows: `repeat(${size}, ${cell}px)`,
        }}
      >
        {rows.map((row) =>
          cols.map((col) => {
            const worldX = startX + col;
            const worldY = startY + row;
            const cellKey = keyOf(worldX, worldY);
            const value = board.get(cellKey);
            const isWin = winKeys.has(cellKey);
            const isLast = !isWin && lastKey === cellKey;

            const baseClass =
              "aspect-square w-full h-full rounded-lg border transition flex items-center justify-center text-xl font-semibold";
            const stateClass = isWin
              ? "bg-emerald-500/20 border-emerald-400"
              : isLast
              ? "bg-sky-500/20 border-sky-400"
              : "border-slate-700/60 hover:bg-muted/50";
            const valueClass = value === "X" ? "text-cyan-300" : "text-rose-300";

            return (
              <button
                key={cellKey}
                type="button"
                className={`${baseClass} ${stateClass} ${value ? valueClass : ""}`}
                onClick={() => onCellClick(worldX, worldY)}
              >
                {value ?? ""}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
