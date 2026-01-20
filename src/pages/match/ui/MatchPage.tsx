import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardViewport, type BoardViewportHandle } from "@/widgets/game-board";
import { buildBoardFromMoves } from "@/entities/board";
import { useMatchById, ReplayControls } from "@/features/match-history";
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE } from "@/shared/config/game";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const MatchPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { match, notFound } = useMatchById(id);
  const [step, setStep] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const boardRef = useRef<BoardViewportHandle | null>(null);

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
      <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
        <div className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-3 py-4 md:px-6 md:py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            {match.winner ? `Winner ${match.winner}` : "Finished (no winner)"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex flex-1 justify-center">
              <BoardViewport
                ref={boardRef}
                board={board}
                lastMove={lastMove}
                winLine={showWinLine ? match.winLine : []}
                initialCellSize={isDesktop ? DESKTOP_CELL_SIZE : MOBILE_CELL_SIZE}
                onCellClick={() => {}}
              />
            </div>
            <div className="flex w-full flex-col gap-5 md:w-64">
              <div className="rounded-lg border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
                Step: {step} / {match.moves.length}
                <br />
                Winner: {match.winner ?? "—"}
              </div>
              <ReplayControls
                step={step}
                maxStep={match.moves.length}
                onChangeStep={(next) =>
                  setStep(Math.max(0, Math.min(next, match.moves.length)))
                }
              />
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
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => boardRef.current?.resetZoom()}
              >
                Reset zoom
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => navigate("/history")}>
                Back to history
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
