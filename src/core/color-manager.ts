import { Color, COLORS, DEFAULT_LEVEL_COLORS } from "../constants/colors";
import type { LogLevel } from "../types/options";

export class ColorManager {
  private readonly customColors: Partial<Record<string, Color>>;

  constructor(customColors: Partial<Record<string, Color>> = {}) {
    this.customColors = customColors;
  }

  getLevelColor(level: LogLevel): string {
    const color = this.customColors[level] ?? DEFAULT_LEVEL_COLORS[level];
    return COLORS[color];
  }
}
