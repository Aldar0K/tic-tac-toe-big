import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardViewport } from "@/widgets/game-board";
import { buildBoardFromMoves } from "@/entities/board";
import { useMatchById, ReplayControls } from "@/features/match-history";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const MatchPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { match, notFound } = useMatchById(id);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (match) {
      setStep(match.moves.length);
    }
  }, [match]);

  if (notFound || !match) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <h1 className="text-2xl font-semibold">Match not found</h1>
          <Button variant="secondary" onClick={() => navigate("/history")}>
            Back to history
          </Button>
        </div>
      </main>
    );
  }

  const { board, lastMove } = buildBoardFromMoves(match.moves, step);
  const showWinLine = match.winner && step === match.moves.length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Match replay</h1>
            <p className="text-sm text-slate-400">
              X: {match.players.xName} vs O: {match.players.oName}
            </p>
          </div>
          <Badge
            className={
              match.winner
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                : "border-slate-700/60 bg-slate-900/60 text-slate-200"
            }
          >
            {match.winner ? `Winner ${match.winner}` : "No winner"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <BoardViewport
              board={board}
              lastMove={lastMove}
              winLine={showWinLine ? match.winLine : []}
              onCellClick={() => {}}
            />
            <ReplayControls
              step={step}
              maxStep={match.moves.length}
              onChangeStep={(next) =>
                setStep(Math.max(0, Math.min(next, match.moves.length)))
              }
            />
            <div className="flex w-full justify-center">
              <Button variant="secondary" onClick={() => navigate("/history")}>
                Back to history
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
