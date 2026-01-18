import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { Match } from "@/entities/match";

type MatchCardProps = {
  match: Match;
  onOpen: () => void;
};

export const MatchCard = ({ match, onOpen }: MatchCardProps) => {
  const createdLabel = new Date(match.createdAt).toLocaleString();
  const winnerLabel = match.winner ? `Winner ${match.winner}` : "No winner";

  return (
    <Card className="bg-slate-950/50">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>
            X: {match.players.xName} vs O: {match.players.oName}
          </CardTitle>
          <p className="text-sm text-slate-400">{createdLabel}</p>
        </div>
        <Badge
          className={
            match.winner
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
              : "border-slate-700/60 bg-slate-900/60 text-slate-200"
          }
        >
          {winnerLabel}
        </Badge>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 pt-0">
        <span className="text-sm text-slate-300">Moves: {match.moves.length}</span>
        <Button variant="ghost" onClick={onOpen}>
          Open
        </Button>
      </CardContent>
    </Card>
  );
};
