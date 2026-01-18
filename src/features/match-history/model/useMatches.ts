import { useCallback, useState } from "react";
import { loadMatches, saveMatches, type Match } from "@/entities/match";

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>(() => loadMatches());

  const reload = useCallback(() => {
    setMatches(loadMatches());
  }, []);

  const removeAll = useCallback(() => {
    saveMatches([]);
    setMatches([]);
  }, []);

  return { matches, reload, removeAll };
};
