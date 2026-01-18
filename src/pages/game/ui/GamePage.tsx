import { Navigate, useNavigate } from "react-router-dom";
import { BoardViewport } from "@/widgets/game-board";
import { useGame } from "@/features/play-turn";
import { getSession } from "@/features/match-setup/model/session";
import { WIN_LEN } from "@/shared/config/game";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const GamePage = () => {
  const navigate = useNavigate();
  const session = getSession();

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
  const statusLabel = game.winner
    ? `Winner: ${winnerName}`
    : `Turn: ${game.currentPlayer === "X" ? session.xName : session.oName}`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">5 in a Row</h1>
            <p className="text-sm text-slate-400">
              {session.xName} vs {session.oName}
            </p>
          </div>
          <Badge
            className={
              game.winner
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                : "border-slate-700/60 bg-slate-900/60 text-slate-200"
            }
          >
            {statusLabel}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <BoardViewport
              board={game.board}
              lastMove={lastMove}
              winLine={game.winLine}
              onCellClick={(x, y) => {
                game.makeMove(x, y);
              }}
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => game.reset()}>
                New game
              </Button>
              <Button
                onClick={() => {
                  game.finishAndPersist();
                  navigate("/history");
                }}
              >
                Finish & Save
              </Button>
              <Button variant="ghost" onClick={() => navigate("/history")}>
                History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
