import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { keyOf } from "@/entities/board";
import { useCamera } from "../model/useCamera";
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
export type BoardViewportHandle = {
  centerOn: (x: number, y: number) => void;
  centerZero: () => void;
  resetZoom: () => void;
};

export const BoardViewport = forwardRef<BoardViewportHandle, BoardViewportProps>(({
  board,
  lastMove,
  winLine,
  onCellClick,
  gridSize,
  cellSize,
  showCoordinates,
  initialCellSize,
  onCameraChange,
}, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.innerWidth;
  });
  const initialCellSizeRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const dragStateRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    moved: false,
  });

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
    centerOn,
    centerZero,
    bind,
  } = useCamera({
    gridSize,
    initialCellSize: initialCellSize ?? cellSize,
  });

  useEffect(() => {
    if (!initialCellSize) return;
    initialCellSizeRef.current = initialCellSize;
    setCellSize(initialCellSize);
  }, [initialCellSize, setCellSize]);

  useEffect(() => {
    if (initialCellSizeRef.current === null) {
      initialCellSizeRef.current = cell;
    }
  }, [cell]);

  useEffect(() => {
    if (!onCameraChange) return;
    onCameraChange({ cameraX, cameraY, cellSize: cell });
  }, [cameraX, cameraY, cell, onCameraChange]);

  useLayoutEffect(() => {
    const node = wrapperRef.current;
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
  const displaySize = containerWidth > 0 ? Math.min(fullSize, containerWidth) : fullSize;
  const displayCell = displaySize / size;
  const fitScale = displayCell / cell;

  useEffect(() => {
    setScale(fitScale);
  }, [fitScale, setScale]);

  useImperativeHandle(
    ref,
    () => ({
      centerOn,
      centerZero,
      resetZoom: () => {
        if (initialCellSizeRef.current !== null) {
          setCellSize(initialCellSizeRef.current);
        }
      },
    }),
    [centerOn, centerZero, setCellSize]
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    bind.onPointerDown(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId === event.pointerId && !state.moved) {
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      if (Math.hypot(dx, dy) > 5) {
        state.moved = true;
      }
    }
    if (state.pointerId === event.pointerId && state.moved) {
      bind.onPointerMove(event);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId === event.pointerId) {
      suppressClickRef.current = state.moved;
      state.pointerId = null;
    }
    bind.onPointerUp(event);
    if (suppressClickRef.current) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-overlay]")) {
      return;
    }

    if (displayCell <= 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const col = Math.floor(offsetX / displayCell);
    const row = Math.floor(offsetY / displayCell);
    if (col < 0 || col >= size || row < 0 || row >= size) {
      return;
    }

    onCellClick(startX + col, startY + row);
    suppressClickRef.current = true;
  };

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
    <div ref={wrapperRef} className="flex w-full max-w-full justify-center">
      <div
        className="relative overflow-hidden select-none touch-none"
        style={{ width: displaySize, height: displaySize }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-950/80 px-2 py-1 text-xs text-slate-200"
          data-overlay
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
            data-overlay
            onPointerDown={(event) => event.stopPropagation()}
          >
            X: {cameraX.toFixed(1)} Y: {cameraY.toFixed(1)}
          </div>
        ) : null}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, ${displayCell}px)`,
          gridTemplateRows: `repeat(${size}, ${displayCell}px)`,
          width: displaySize,
          height: displaySize,
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
                onClick={() => {
                  if (suppressClickRef.current) {
                    suppressClickRef.current = false;
                    return;
                  }
                  onCellClick(worldX, worldY);
                }}
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
});

BoardViewport.displayName = "BoardViewport";
