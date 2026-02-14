export type CabinetType = "16:9" | "1:1";

export type ParamKey = "ar" | "height" | "width" | "diagonal";

export type Unit = "mm" | "m" | "ft" | "in";

export interface CabinetSpec {
  widthMm: number;
  heightMm: number;
  aspectRatio: number;
}

export interface AspectRatioPreset {
  label: string;
  value: number; // W/H
}

export interface ConfigResult {
  columns: number;
  rows: number;
  totalCabinets: number;
  widthMm: number;
  heightMm: number;
  diagonalMm: number;
  aspectRatio: number;
}

export type ResultKind = "lower" | "upper";

export interface ConfigResultWithKind extends ConfigResult {
  kind: ResultKind;
}

export interface CalculatorInputs {
  cabinetType: CabinetType;
  paramAr: number | null;
  paramHeight: number | null;
  paramWidth: number | null;
  paramDiagonal: number | null;
  selectedParams: ParamKey[];
  unit: Unit;
}

export interface CalculatorOutput {
  lower: ConfigResult | null;
  upper: ConfigResult | null;
  targetWidthMm: number;
  targetHeightMm: number;
  targetDiagonalMm: number;
  targetAspectRatio: number;
}
