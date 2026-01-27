# История матчей

## Назначение

Модуль истории отвечает за:
- хранение сыгранных матчей в `localStorage`
- отображение списка матчей
- просмотр конкретного матча
- реплей по шагам

## Домен (entities)

**Домен** — это слой `entities`, где описаны базовые сущности и их структура.
В данном случае домен — это `entities/match`:

```ts
type Match = {
  id: string;
  players: { xName: string; oName: string };
  createdAt: number;
  finishedAt: number | null;
  winner: "X" | "O" | null;
  winLine: Array<{x:number;y:number}>;
  moves: Array<{ x:number; y:number; player:"X"|"O"; at:number }>;
};
```

Это ядро данных. Оно не меняется, когда мы добавляем новые UI‑фичи.

## Хранилище

`src/entities/match/api/localStorage.ts`

- `loadMatches()` — загрузка массива матчей (fallback на `[]`)
- `saveMatches(matches)` — сохранение, сортировка по `createdAt`
- `addMatch(match)` — добавление нового матча
- `updateMatch(match)` — обновление матча по id
- `getMatchById(id)` — получить матч по id

## Feature‑слой

`src/features/match-history`

### useMatches
Возвращает:
- `matches` — список матчей
- `reload()` — перечитать список
- `removeAll()` — очистить историю

### useMatchById
Возвращает:
- `match` — матч или `null`
- `notFound` — флаг отсутствия

## UI‑компоненты

### MatchCard
Показывает:
- имена игроков
- дату создания
- победителя / "Finished (no winner)"
- количество ходов и длительность

### MatchList
Список карточек или текст "No matches yet".

### ReplayControls
Кнопки + слайдер для перемотки шага.

## Pages

### /history
- Список матчей
- Кнопки: назад в игру, очистить историю
- Empty state, если матчей нет

### /history/:id
- Реплей конкретного матча
- Шаг (step) по умолчанию = последний
- `buildBoardFromMoves(moves, step)` строит состояние
- winLine подсвечивается только на финальном шаге

## Расширение

Благодаря тому, что доменная структура матча уже определена в `entities/match`,
можно добавлять фильтры, поиск или статистику без изменения доменной модели —
это делается на уровне `features` и `pages`.
