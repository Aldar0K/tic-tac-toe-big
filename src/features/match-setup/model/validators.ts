export const normalizeName = (name: string): string =>
  name.trim().replace(/\s+/g, " ");

export const validateName = (name: string): string | null => {
  const normalized = normalizeName(name);
  if (!normalized) return "Name is required";
  if (normalized.length < 2) return "Name must be at least 2 characters";
  if (normalized.length > 20) return "Name must be 20 characters or less";
  return null;
};
