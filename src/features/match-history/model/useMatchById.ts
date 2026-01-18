import { getMatchById, type Match } from "@/entities/match";

type UseMatchByIdResult = {
  match: Match | null;
  notFound: boolean;
};

export const useMatchById = (id: string | undefined): UseMatchByIdResult => {
  if (!id) {
    return { match: null, notFound: true };
  }

  const match = getMatchById(id);
  return { match, notFound: !match };
};
