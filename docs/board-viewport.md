# BoardViewport

## Назначение

`BoardViewport` — виджет, который отображает фиксированное окно `GRID_SIZE × GRID_SIZE`
на бесконечной плоскости. Он **не знает** про игровую логику, победу или историю.
Его задача — рендер клеток, обработка drag/zoom и корректные клики по координатам.

## Входные данные

```ts
{
  board: Map<string, "X" | "O">,
  lastMove?: { x: number; y: number },
  winLine?: Array<{ x: number; y: number }>,
  onCellClick(x: number, y: number): void,
  gridSize?: number,
  cellSize?: number,
  showCoordinates?: boolean,
  initialCellSize?: number,
  onCameraChange?: (camera) => void
}
```

Дополнительно через ref:

```ts
BoardViewportHandle = {
  centerOn(x, y),
  centerZero(),
  resetZoom()
}
```

## Мировые координаты

Клетки идентифицируются мировыми координатами `(x, y)` и хранятся в `Map` по ключу `"x:y"`.
Viewport показывает **кусок мира** размером `gridSize × gridSize`.

Формулы:

```
startX = floor(cameraX - gridSize / 2)
startY = floor(cameraY - gridSize / 2)

worldX = startX + col
worldY = startY + row
```

## Камера и drag

Камера хранит `cameraX/cameraY` (float в клетках).  
Drag вычисляет смещение pointer (px) и переводит в клетки:

```
dxCells = dxPx / (cellSize * scale)
dyCells = dyPx / (cellSize * scale)
cameraX = startCameraX - dxCells
cameraY = startCameraY - dyCells
```

Есть порог 5px, чтобы отличать drag от клика.

## Zoom и размер клетки

`cellSize` регулируется кнопками `+/-`.  
Чтобы поле всегда помещалось в контейнере:

```
displaySize = min(fullSize, containerWidth)
displayCell = displaySize / gridSize
```

Сетка рендерится с `displayCell`, поэтому **не возникает горизонтального скролла**.

## Клики по клеткам

Клик считается **на pointerup**, если не было drag:

```
col = floor(offsetX / displayCell)
row = floor(offsetY / displayCell)
worldX = startX + col
worldY = startY + row
```

Это защищает от конфликтов с `pointer capture`.

## Подсветка

Приоритет подсветки:
1. `winLine` (зелёная)
2. `lastMove` (синяя)
3. обычная клетка

## Управление извне

Через `ref` страница может:
- центрировать камеру в (0,0)
- центрировать камеру на последнем ходе
- сбрасывать zoom

Так сохраняется FSD‑граница: UI управляет камерой, но игровая логика остаётся в `useGame`.
