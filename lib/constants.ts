import type { CabinetSpec, AspectRatioPreset } from "./types";

export const CABINETS: Record<"16:9" | "1:1", CabinetSpec> = {
  "16:9": {
    widthMm: 600,
    heightMm: 337.5,
    aspectRatio: 16 / 9,
  },
  "1:1": {
    widthMm: 500,
    heightMm: 500,
    aspectRatio: 1,
  },
};

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: "16:9", value: 16 / 9 },
  { label: "16:10", value: 16 / 10 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "21:9", value: 21 / 9 },
];

/** mm per unit (1 unit in that system = X mm) */
export const MM_PER_UNIT: Record<string, number> = {
  mm: 1,
  m: 1000,
  ft: 304.8,
  in: 25.4,
};

export const MIN_COLS = 1;
export const MIN_ROWS = 1;
export const MAX_GRID_DISPLAY = 24; // cap grid diagram size
