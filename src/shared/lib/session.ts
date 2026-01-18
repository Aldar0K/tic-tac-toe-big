export const SESSION_KEY = "amicon_ttt_session_v1";

export type Session = { xName: string; oName: string };

const safeParseSession = (raw: string | null): Session | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.xName !== "string" ||
      typeof parsed.oName !== "string"
    ) {
      return null;
    }
    return { xName: parsed.xName, oName: parsed.oName };
  } catch {
    return null;
  }
};

export const getSession = (): Session | null => {
  if (typeof sessionStorage === "undefined") return null;
  return safeParseSession(sessionStorage.getItem(SESSION_KEY));
};

export const setSession = (session: Session): void => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
};
