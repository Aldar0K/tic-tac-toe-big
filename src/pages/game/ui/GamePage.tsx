import { Navigate, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { BoardViewport, type BoardViewportHandle } from "@/widgets/game-board";
import { useGame } from "@/features/play-turn";
import { clearSession, getSession } from "@/features/match-setup";
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, WIN_LEN } from "@/shared/config/game";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const GamePage = () => {
  const navigate = useNavigate();
  const session = getSession();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const boardRef = useRef<BoardViewportHandle | null>(null);
  const [camera, setCamera] = useState({ cameraX: 0, cameraY: 0, cellSize: MOBILE_CELL_SIZE });

  const game = useGame({
    xName: session?.xName ?? "Player X",
    oName: session?.oName ?? "Player O",
    winLen: WIN_LEN,
  });

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const lastMove = game.moves[game.moves.length - 1];
  const winnerName =
    game.winner === "X" ? session.xName : game.winner === "O" ? session.oName : null;
  const statusLabel = useMemo(() => {
    if (game.winner) {
      return `Winner: ${winnerName}`;
    }
    if (game.isPersisted) {
      return "Finished (no winner)";
    }
    const currentName = game.currentPlayer === "X" ? session.xName : session.oName;
    return `Turn: ${game.currentPlayer} (${currentName})`;
  }, [game.currentPlayer, game.isPersisted, game.winner, session.oName, session.xName, winnerName]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-3 py-4 md:px-6 md:py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">5 in a Row</h1>
            <p className="text-sm text-slate-400">
              {session.xName} vs {session.oName}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                game.winner
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                  : "border-slate-700/60 bg-slate-900/60 text-slate-200"
              }
            >
              {statusLabel}
            </Badge>
            <Button
              variant="ghost"
              onClick={() => {
                clearSession();
                navigate("/login");
              }}
            >
              Log out / change players
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex flex-1 justify-center">
              <BoardViewport
                ref={boardRef}
                board={game.board}
                lastMove={lastMove}
                winLine={game.winLine}
                initialCellSize={isDesktop ? DESKTOP_CELL_SIZE : MOBILE_CELL_SIZE}
                showCoordinates
                onCameraChange={setCamera}
                onCellClick={(x, y) => {
                  game.makeMove(x, y);
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-4 md:w-64">
              {game.winner ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Game finished. {winnerName} wins.
                </div>
              ) : null}
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
                Drag to pan • Use +/- to zoom
              </div>
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
                Center: x={camera.cameraX.toFixed(1)}, y={camera.cameraY.toFixed(1)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => boardRef.current?.centerZero()}
                >
                  Reset camera
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => boardRef.current?.resetZoom()}
                >
                  Reset zoom
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => {
                    if (lastMove) {
                      boardRef.current?.centerOn(lastMove.x, lastMove.y);
                    }
                  }}
                  disabled={!lastMove}
                >
                  Center on last move
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="w-full sm:w-auto" variant="secondary" onClick={() => game.reset()}>
                  New game
                </Button>
                {game.winner ? (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      game.finishAndPersist();
                      navigate("/history");
                    }}
                    disabled={game.isPersisted}
                  >
                    Save match
                  </Button>
                ) : (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      game.finishAndPersist();
                      navigate("/history");
                    }}
                    disabled={game.isPersisted}
                  >
                    Finish & save
                  </Button>
                )}
                <Button
                  className="w-full sm:w-auto"
                  variant="ghost"
                  onClick={() => navigate("/history")}
                >
                  Back to history
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
