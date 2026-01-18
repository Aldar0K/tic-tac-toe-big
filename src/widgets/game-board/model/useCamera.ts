import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react";
import { DEFAULT_CELL_SIZE, GRID_SIZE } from "@/shared/config/game";

type UseCameraParams = {
  gridSize?: number;
  cellSize?: number;
};

type PointerState = {
  pointerId: number | null;
  startPointerX: number;
  startPointerY: number;
  startCameraX: number;
  startCameraY: number;
};

export const useCamera = ({ gridSize, cellSize }: UseCameraParams = {}) => {
  const resolvedGridSize = gridSize ?? GRID_SIZE;
  const resolvedCellSize = cellSize ?? DEFAULT_CELL_SIZE;

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
      const dxCells = dxPx / resolvedCellSize;
      const dyCells = dyPx / resolvedCellSize;
      setCameraX(state.startCameraX - dxCells);
      setCameraY(state.startCameraY - dyCells);
    },
    [resolvedCellSize]
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

  return {
    cameraX,
    cameraY,
    cellSize: resolvedCellSize,
    gridSize: resolvedGridSize,
    startX,
    startY,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
};
