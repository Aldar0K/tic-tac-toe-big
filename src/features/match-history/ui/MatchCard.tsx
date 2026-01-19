import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import type { Match } from "@/entities/match";

type MatchCardProps = {
  match: Match;
  onOpen: () => void;
};

export const MatchCard = ({ match, onOpen }: MatchCardProps) => {
  const createdLabel = new Date(match.createdAt).toLocaleString();
  const winnerLabel = match.winner ? `Winner ${match.winner}` : "No winner";
  const durationLabel = match.finishedAt
    ? formatDuration(match.finishedAt - match.createdAt)
    : null;

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
        <div className="text-sm text-slate-300">
          <span>Moves: {match.moves.length}</span>
          {durationLabel ? <span className="ml-2">• {durationLabel}</span> : null}
        </div>
        <Button variant="ghost" onClick={onOpen}>
          Open
        </Button>
      </CardContent>
    </Card>
  );
};

const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const seconds = totalSeconds % 60;
  const minutesTotal = Math.floor(totalSeconds / 60);
  const minutes = minutesTotal % 60;
  const hours = Math.floor(minutesTotal / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};
