import { useNavigate } from "react-router-dom";
import { useMatches, MatchList } from "@/features/match-history";
import { Button } from "@/shared/ui";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { matches, removeAll } = useMatches();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Match history</h1>
            <p className="text-sm text-slate-400">Recent games</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate("/game")}>
              Back to game
            </Button>
            {removeAll ? (
              <Button
                variant="ghost"
                onClick={() => {
                  const confirmed = window.confirm("Clear all match history?");
                  if (confirmed) {
                    removeAll();
                  }
                }}
                disabled={matches.length === 0}
              >
                Clear history
              </Button>
            ) : null}
          </div>
        </div>

        <MatchList matches={matches} onOpen={(id) => navigate(`/history/${id}`)} />
      </div>
    </main>
  );
};
