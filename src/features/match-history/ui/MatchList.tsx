import type { Match } from "@/entities/match";
import { MatchCard } from "./MatchCard";

type MatchListProps = {
  matches: Match[];
  onOpen: (id: string) => void;
};

export const MatchList = ({ matches, onOpen }: MatchListProps) => {
  if (!matches.length) {
    return <p className="text-sm text-slate-400">No matches yet</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onOpen={() => onOpen(match.id)} />
      ))}
    </div>
  );
};
