import type { CabinetType, ParamKey, ConfigResult, CalculatorOutput } from "./types";
import { CABINETS } from "./constants";
import type { CabinetSpec } from "./types";

const MIN_ROWS = 1;
const MIN_COLS = 1;

/** Derive target width and height (mm) from the two selected parameters. */
function deriveTargetDimensions(
  params: ParamKey[],
  values: { ar: number | null; height: number | null; width: number | null; diagonal: number | null },
  unitToMm: (value: number) => number
): { widthMm: number; heightMm: number } | null {
  const set = new Set(params);
  const ar = values.ar ?? null;

  if (set.has("ar") && set.has("height") && ar != null && values.height != null) {
    const heightMm = unitToMm(values.height);
    return { widthMm: heightMm * ar, heightMm };
  }
  if (set.has("ar") && set.has("width") && ar != null && values.width != null) {
    const widthMm = unitToMm(values.width);
    return { widthMm, heightMm: widthMm / ar };
  }
  if (set.has("ar") && set.has("diagonal") && ar != null && values.diagonal != null) {
    const d = unitToMm(values.diagonal);
    const heightMm = d / Math.sqrt(ar * ar + 1);
    return { widthMm: heightMm * ar, heightMm };
  }
  if (set.has("height") && set.has("width") && values.height != null && values.width != null) {
    return { widthMm: unitToMm(values.width), heightMm: unitToMm(values.height) };
  }
  if (set.has("height") && set.has("diagonal") && values.height != null && values.diagonal != null) {
    const heightMm = unitToMm(values.height);
    const d = unitToMm(values.diagonal);
    const wSq = d * d - heightMm * heightMm;
    if (wSq < 0) return null;
    return { widthMm: Math.sqrt(wSq), heightMm };
  }
  if (set.has("width") && set.has("diagonal") && values.width != null && values.diagonal != null) {
    const widthMm = unitToMm(values.width);
    const d = unitToMm(values.diagonal);
    const hSq = d * d - widthMm * widthMm;
    if (hSq < 0) return null;
    return { widthMm, heightMm: Math.sqrt(hSq) };
  }
  return null;
}

/** Continued fraction: find best rational approximations N/M for targetRatio, with denominator <= maxDenom. */
function convergents(targetRatio: number, maxDenom: number): Array<{ n: number; m: number }> {
  const scale = 1e9;
  let restP = Math.round(targetRatio * scale);
  let restQ = scale;
  let prevP = 0,
    curP = 1;
  let prevQ = 1,
    curQ = 0;
  const results: Array<{ n: number; m: number }> = [];

  while (restQ !== 0) {
    const intPart = Math.floor(restP / restQ);
    const rem = restP % restQ;
    const nextP = curP * intPart + prevP;
    const nextQ = curQ * intPart + prevQ;

    if (nextQ > maxDenom) {
      const maxT = Math.max(0, Math.floor((maxDenom - prevQ) / curQ));
      if (maxT > 0) {
        const n = curP * maxT + prevP;
        const m = curQ * maxT + prevQ;
        if (n >= MIN_COLS && m >= MIN_ROWS) results.push({ n, m });
      }
      break;
    }

    if (nextP >= MIN_COLS && nextQ >= MIN_ROWS) results.push({ n: nextP, m: nextQ });
    prevP = curP;
    curP = nextP;
    prevQ = curQ;
    curQ = nextQ;
    restP = restQ;
    restQ = rem;
  }
  return results;
}

function configFromGrid(N: number, M: number, cab: CabinetSpec): ConfigResult {
  const widthMm = N * cab.widthMm;
  const heightMm = M * cab.heightMm;
  const diagonalMm = Math.sqrt(widthMm * widthMm + heightMm * heightMm);
  const aspectRatio = widthMm / heightMm;
  return {
    columns: N,
    rows: M,
    totalCabinets: N * M,
    widthMm,
    heightMm,
    diagonalMm,
    aspectRatio,
  };
}

function score(
  cfg: ConfigResult,
  targetW: number,
  targetH: number,
  targetAR: number
): number {
  const dimScore =
    (Math.abs(cfg.widthMm - targetW) / (targetW || 1) +
      Math.abs(cfg.heightMm - targetH) / (targetH || 1)) /
    2;
  const arScore = Math.abs(cfg.aspectRatio - targetAR) / (targetAR || 1);
  return dimScore + arScore;
}

const TOLERANCE = 0.01;

function isLower(cfg: ConfigResult, targetW: number, targetH: number): boolean {
  return cfg.widthMm <= targetW + TOLERANCE && cfg.heightMm <= targetH + TOLERANCE;
}

function isAtOrAboveTarget(cfg: ConfigResult, targetW: number, targetH: number): boolean {
  return cfg.widthMm >= targetW - TOLERANCE && cfg.heightMm >= targetH - TOLERANCE;
}

function isExactMatch(cfg: ConfigResult, targetW: number, targetH: number): boolean {
  return (
    Math.abs(cfg.widthMm - targetW) <= TOLERANCE &&
    Math.abs(cfg.heightMm - targetH) <= TOLERANCE
  );
}

/** Upper = at or above target. If there is an exact match (a lower that matches target), upper must be strictly above. */
function isUpper(
  cfg: ConfigResult,
  targetW: number,
  targetH: number,
  hasExactMatch: boolean
): boolean {
  if (!isAtOrAboveTarget(cfg, targetW, targetH)) return false;
  if (hasExactMatch) {
    return cfg.widthMm > targetW + TOLERANCE || cfg.heightMm > targetH + TOLERANCE;
  }
  return true;
}

export function calculate(
  cabinetType: CabinetType,
  selectedParams: ParamKey[],
  values: { ar: number | null; height: number | null; width: number | null; diagonal: number | null },
  unitToMm: (value: number) => number
): CalculatorOutput | null {
  if (selectedParams.length !== 2) return null;

  const dims = deriveTargetDimensions(selectedParams, values, unitToMm);
  if (!dims) return null;

  const { widthMm: targetW, heightMm: targetH } = dims;
  const targetD = Math.sqrt(targetW * targetW + targetH * targetH);
  const targetAR = targetW / targetH;

  const cab = CABINETS[cabinetType];

  const candidates: ConfigResult[] = [];
  const hasAr = selectedParams.includes("ar");

  if (hasAr) {
    const targetRatio = (targetAR * cab.heightMm) / cab.widthMm;
    const maxDenom = Math.max(
      50,
      Math.ceil(targetH / cab.heightMm) + 5,
      Math.ceil(targetW / cab.widthMm) + 5
    );
    const ratioPairs = convergents(targetRatio, maxDenom);

    for (const { n: N, m: M } of ratioPairs) {
      candidates.push(configFromGrid(N, M, cab));
    }

    const targetRowsLo = Math.max(MIN_ROWS, Math.floor(targetH / cab.heightMm));
    const targetRowsHi = Math.max(MIN_ROWS, Math.ceil(targetH / cab.heightMm));
    const targetColsLo = Math.max(MIN_COLS, Math.floor(targetW / cab.widthMm));
    const targetColsHi = Math.max(MIN_COLS, Math.ceil(targetW / cab.widthMm));

    for (const M of [targetRowsLo, targetRowsHi].filter((m) => m >= MIN_ROWS)) {
      const N = Math.max(MIN_COLS, Math.round((targetAR * M * cab.heightMm) / cab.widthMm));
      for (const n of [N - 1, N, N + 1].filter((n) => n >= MIN_COLS)) {
        candidates.push(configFromGrid(n, M, cab));
      }
    }
    for (const N of [targetColsLo, targetColsHi].filter((n) => n >= MIN_COLS)) {
      const M = Math.max(MIN_ROWS, Math.round((N * cab.widthMm) / (targetAR * cab.heightMm)));
      for (const m of [M - 1, M, M + 1].filter((m) => m >= MIN_ROWS)) {
        candidates.push(configFromGrid(N, m, cab));
      }
    }
  } else {
    const targetRowsLo = Math.max(MIN_ROWS, Math.floor(targetH / cab.heightMm));
    const targetRowsHi = Math.max(MIN_ROWS, Math.ceil(targetH / cab.heightMm));
    const targetColsLo = Math.max(MIN_COLS, Math.floor(targetW / cab.widthMm));
    const targetColsHi = Math.max(MIN_COLS, Math.ceil(targetW / cab.widthMm));

    for (const M of [targetRowsLo, targetRowsHi]) {
      for (const N of [targetColsLo, targetColsHi]) {
        candidates.push(configFromGrid(N, M, cab));
      }
    }
  }

  const unique = new Map<string, ConfigResult>();
  for (const c of candidates) {
    const key = `${c.columns}x${c.rows}`;
    if (!unique.has(key)) unique.set(key, c);
  }
  const all = Array.from(unique.values());

  const lowers = all.filter((c) => isLower(c, targetW, targetH));
  const hasExactMatch = lowers.some((c) => isExactMatch(c, targetW, targetH));
  const uppers = all.filter((c) => isUpper(c, targetW, targetH, hasExactMatch));

  const bestLower =
    lowers.length > 0
      ? lowers.reduce((best, c) => (score(c, targetW, targetH, targetAR) < score(best, targetW, targetH, targetAR) ? c : best))
      : null;
  const bestUpper =
    uppers.length > 0
      ? uppers.reduce((best, c) => (score(c, targetW, targetH, targetAR) < score(best, targetW, targetH, targetAR) ? c : best))
      : null;

  return {
    lower: bestLower,
    upper: bestUpper,
    targetWidthMm: targetW,
    targetHeightMm: targetH,
    targetDiagonalMm: targetD,
    targetAspectRatio: targetAR,
  };
}
