export const VERDICTS = ["true", "false", "uncertain"] as const;

export type Verdict = (typeof VERDICTS)[number];

const trueRatings = new Set([
  // English
  "true",
  "mostly true",
  "correct",
  "accurate",
  "supported",
  // Portuguese
  "verdadeiro",
  "verdade",
  "correto",
  "certo",
  "majoritariamente verdadeiro",
  "parcialmente verdadeiro",
]);

const falseRatings = new Set([
  // English
  "false",
  "mostly false",
  "pants on fire",
  "incorrect",
  "misleading",
  "refuted",
  // Portuguese
  "falso",
  "mentira",
  "errado",
  "incorreto",
  "enganoso",
  "distorcido",
  "insustentável",
  "exagerado",
  "impreciso",
]);

export const normalizeVerdict = (rating: string): Verdict => {
  const normalized = rating.trim().toLowerCase();

  if (trueRatings.has(normalized)) {
    return "true";
  }

  if (falseRatings.has(normalized)) {
    return "false";
  }

  return "uncertain";
};

export const isVerdict = (value: string): value is Verdict =>
  VERDICTS.includes(value as Verdict);
