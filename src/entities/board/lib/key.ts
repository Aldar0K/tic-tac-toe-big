export const keyOf = (x: number, y: number): string => `${x}:${y}`;

export const parseKey = (key: string): { x: number; y: number } => {
  const [xRaw, yRaw] = key.split(":");
  return { x: Number(xRaw), y: Number(yRaw) };
};
