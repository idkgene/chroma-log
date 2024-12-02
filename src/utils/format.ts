import { Color, COLORS } from "../constants/colors";

const ansiRegex = /\x1b\[[0-9;]*m/g;

export function stripAnsiCodes(str: string): string {
  return str.replace(ansiRegex, "");
}

export function colorize(text: string, color: string): string {
  return `\x1b[${color}m${text}\x1b[0m`;
}

const objectCache = new WeakMap<object, string>();

export function formatData<T>(data: T, color?: Color): string {
  if (data === null) return "null";
  
  if (typeof data === "object") {
    let formatted = objectCache.get(data as object);
    if (!formatted) {
      formatted = JSON.stringify(data, null, 2);
      objectCache.set(data as object, formatted);
    }
    return color ? colorize(formatted, COLORS[color]) : formatted;
  }
  
  const formatted = String(data);
  return color ? colorize(formatted, COLORS[color]) : formatted;
}
