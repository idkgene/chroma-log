export type Color =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

export const COLORS: Readonly<Record<Color, string>> = {
  black: "30",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  magenta: "35",
  cyan: "36",
  white: "37",
} as const;

export const DEFAULT_LEVEL_COLORS = {
  info: "cyan",
  warn: "yellow",
  error: "red",
  debug: "magenta",
} as const;
