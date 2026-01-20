import { useNavigate } from "react-router-dom";
import { useMatches, MatchList } from "@/features/match-history";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { matches, removeAll } = useMatches();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 py-4 md:px-6 md:py-8">
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

        {matches.length === 0 ? (
          <Card className="bg-slate-950/50">
            <CardHeader>
              <CardTitle>No matches yet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-slate-400">
                Start a game to see your match history here.
              </p>
              <Button variant="secondary" onClick={() => navigate("/game")}>
                Go to game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <MatchList matches={matches} onOpen={(id) => navigate(`/history/${id}`)} />
        )}
      </div>
    </main>
  );
};
