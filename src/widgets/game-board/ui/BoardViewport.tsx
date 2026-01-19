import { useEffect, useMemo, useRef, useState } from "react";
import { keyOf } from "@/entities/board";
import { useCamera } from "@/widgets/game-board/model/useCamera";
import { Button } from "@/shared/ui";

type BoardViewportProps = {
  board: Map<string, "X" | "O">;
  lastMove?: { x: number; y: number };
  winLine?: Array<{ x: number; y: number }>;
  onCellClick: (x: number, y: number) => void;
  gridSize?: number;
  cellSize?: number;
  showCoordinates?: boolean;
  initialCellSize?: number;
  onCameraChange?: (camera: { cameraX: number; cameraY: number; cellSize: number }) => void;
};

// Example: <BoardViewport board={board} onCellClick={(x, y) => makeMove(x, y)} />
export const BoardViewport = ({
  board,
  lastMove,
  winLine,
  onCellClick,
  gridSize,
  cellSize,
  showCoordinates,
  initialCellSize,
  onCameraChange,
}: BoardViewportProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const {
    cameraX,
    cameraY,
    startX,
    startY,
    gridSize: size,
    cellSize: cell,
    setCellSize,
    setScale,
    zoomIn,
    zoomOut,
    bind,
  } = useCamera({
    gridSize,
    initialCellSize: initialCellSize ?? cellSize,
  });

  useEffect(() => {
    if (!initialCellSize) return;
    setCellSize(initialCellSize);
  }, [initialCellSize, setCellSize]);

  useEffect(() => {
    if (!onCameraChange) return;
    onCameraChange({ cameraX, cameraY, cellSize: cell });
  }, [cameraX, cameraY, cell, onCameraChange]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => setContainerWidth(node.clientWidth);
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const fullSize = size * cell;
  const fitScale = containerWidth > 0 ? Math.min(1, containerWidth / fullSize) : 1;
  const displayCell = cell * fitScale;

  useEffect(() => {
    setScale(fitScale);
  }, [fitScale, setScale]);

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
    <div ref={containerRef} className="flex w-full max-w-full justify-center">
      <div
        className="relative inline-block max-w-full overflow-hidden select-none touch-none"
        style={{ width: size * displayCell, height: size * displayCell }}
        {...bind}
      >
        <div
          className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-950/80 px-2 py-1 text-xs text-slate-200"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Button size="icon" variant="ghost" onClick={zoomOut} type="button">
            -
          </Button>
          <span className="min-w-[48px] text-center">{Math.round(cell)}px</span>
          <Button size="icon" variant="ghost" onClick={zoomIn} type="button">
            +
          </Button>
        </div>
        {showCoordinates ? (
          <div
            className="absolute left-3 top-3 z-10 rounded-md border border-slate-800/70 bg-slate-950/80 px-2 py-1 text-xs text-slate-200"
            onPointerDown={(event) => event.stopPropagation()}
          >
            X: {cameraX.toFixed(1)} Y: {cameraY.toFixed(1)}
          </div>
        ) : null}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cell}px)`,
          gridTemplateRows: `repeat(${size}, ${cell}px)`,
          transform: `scale(${fitScale})`,
          transformOrigin: "top left",
          width: fullSize,
          height: fullSize,
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
              ? "bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400"
              : isLast
              ? "bg-sky-500/25 border-sky-300 ring-2 ring-sky-300"
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
    </div>
  );
};
