# tic-tac-toe-big

## Run locally

```bash
npm install
npm run dev
npm run test
npm run build
```

## Project structure (FSD)

```
src/
  app/       # router + app providers
  pages/     # login / game / history / match
  widgets/   # game board viewport
  features/  # match setup, play turn, match history
  entities/  # board + match domain
  shared/    # ui, lib, config
```

## Flow diagram

```text
Login page
  |
  v
sessionStorage (players)
  |
  v
Game page --- useGame ---> BoardViewport (pan/zoom)
  |
  v
finishAndPersist -> localStorage (matches)
  |
  v
History page -> open match -> Match page
                          |
                          v
               buildBoardFromMoves -> Replay viewport + step
```

## Features

- Login with two player names (session stored in sessionStorage).
- Infinite plane via sparse Map + 20x20 viewport with drag and zoom.
- Win detection from last move (5 in a row).
- Match history in localStorage with replay controls.

## How to play

- Enter both player names on `/login` and start the game.
- Click a cell to place X/O, drag to pan, use +/- to zoom.
- Win condition: 5 in a row horizontally, vertically, or diagonally.
- Viewport size: 20x20 cells (fixed window).
- Use “Finish & save” to save a match without a winner.

## Screens

- `/login`
- `/game`
- `/history`
- `/history/:id`

## Assumptions

- No automatic draw detection due to infinite board; a draw is a manual finish without a winner.
- Player names are stored in sessionStorage for the current session.
