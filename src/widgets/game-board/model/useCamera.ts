import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  DESKTOP_CELL_SIZE,
  GRID_SIZE,
  MAX_CELL_SIZE,
  MIN_CELL_SIZE,
} from "@/shared/config/game";
import { clamp } from "@/shared/lib/clamp";

type UseCameraParams = {
  gridSize?: number;
  initialCellSize?: number;
};

type PointerState = {
  pointerId: number | null;
  startPointerX: number;
  startPointerY: number;
  startCameraX: number;
  startCameraY: number;
};

export const useCamera = ({
  gridSize,
  initialCellSize,
}: UseCameraParams = {}) => {
  const resolvedGridSize = gridSize ?? GRID_SIZE;
  const [cellSize, setCellSizeState] = useState(() =>
    clamp(initialCellSize ?? DESKTOP_CELL_SIZE, MIN_CELL_SIZE, MAX_CELL_SIZE)
  );
  const [scale, setScale] = useState(1);

  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);

  const pointerStateRef = useRef<PointerState>({
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startCameraX: 0,
    startCameraY: 0,
  });

  const startX = useMemo(
    () => Math.floor(cameraX - resolvedGridSize / 2),
    [cameraX, resolvedGridSize]
  );
  const startY = useMemo(
    () => Math.floor(cameraY - resolvedGridSize / 2),
    [cameraY, resolvedGridSize]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (pointerStateRef.current.pointerId !== null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerStateRef.current = {
        pointerId: event.pointerId,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startCameraX: cameraX,
        startCameraY: cameraY,
      };
    },
    [cameraX, cameraY]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = pointerStateRef.current;
      if (state.pointerId !== event.pointerId) return;
      const dxPx = event.clientX - state.startPointerX;
      const dyPx = event.clientY - state.startPointerY;
      const effectiveCellSize = cellSize * scale;
      const dxCells = dxPx / effectiveCellSize;
      const dyCells = dyPx / effectiveCellSize;
      setCameraX(state.startCameraX - dxCells);
      setCameraY(state.startCameraY - dyCells);
    },
    [cellSize, scale]
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = pointerStateRef.current;
      if (state.pointerId !== event.pointerId) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      pointerStateRef.current.pointerId = null;
    },
    []
  );

  const setCellSize = useCallback((next: number) => {
    setCellSizeState(clamp(next, MIN_CELL_SIZE, MAX_CELL_SIZE));
  }, []);

  const zoomIn = useCallback(() => {
    setCellSizeState((prev) => clamp(prev + 4, MIN_CELL_SIZE, MAX_CELL_SIZE));
  }, []);

  const zoomOut = useCallback(() => {
    setCellSizeState((prev) => clamp(prev - 4, MIN_CELL_SIZE, MAX_CELL_SIZE));
  }, []);

  const centerOn = useCallback((x: number, y: number) => {
    setCameraX(x);
    setCameraY(y);
  }, []);

  const centerZero = useCallback(() => {
    centerOn(0, 0);
  }, [centerOn]);

  return {
    cameraX,
    cameraY,
    cellSize,
    scale,
    gridSize: resolvedGridSize,
    startX,
    startY,
    setCellSize,
    setScale,
    zoomIn,
    zoomOut,
    centerOn,
    centerZero,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
};
