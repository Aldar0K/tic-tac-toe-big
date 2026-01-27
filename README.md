# tic-tac-toe-big

## Запуск локально

```bash
npm install
npm run dev
npm run test
npm run build
```

## Структура проекта (FSD)

```
src/
  app/       # роутер и композиция приложения
  pages/     # страницы: login / game / history / match
  widgets/   # виджеты: игровое поле
  features/  # фичи: настройка матча, ход, история
  entities/  # домен: board, match
  shared/    # ui, lib, config
```

## Диаграмма потока

```text
Login
  |
  v
sessionStorage (игроки)
  |
  v
Game --- useGame ---> BoardViewport (пан/зум)
  |
  v
finishAndPersist -> localStorage (матчи)
  |
  v
History -> открыть матч -> Match
                          |
                          v
               buildBoardFromMoves -> Реплей + шаг
```

## Возможности

- Вход с именами двух игроков (sessionStorage).
- Бесконечная плоскость через разреженный Map + viewport 20x20, панорамирование и зум.
- Победа определяется от последнего хода (5 в ряд).
- История матчей в localStorage + реплей.

## Как играть

- Введите имена на `/login` и начните игру.
- Клик по клетке ставит X/O, drag — панорама, +/- — зум.
- Победа: 5 в ряд по горизонтали/вертикали/диагонали.
- Размер окна: 20x20 клеток (фиксированное окно).
- “Finish & save” сохраняет матч без победителя.

## Экраны

- `/login`
- `/game`
- `/history`
- `/history/:id`

## Допущения

- Авто-ничья не определяется из-за бесконечного поля; ничья — ручное завершение.
- Имена игроков хранятся в sessionStorage на время сессии.

## Документация

- `docs/coordinates.md` — система координат и маппинг viewport
- `docs/board-viewport.md` — устройство BoardViewport (drag/zoom/клики)
