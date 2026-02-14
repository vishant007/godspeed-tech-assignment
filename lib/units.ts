import type { Unit } from "./types";
import { MM_PER_UNIT } from "./constants";

export function toMm(value: number, unit: Unit): number {
  return value * MM_PER_UNIT[unit];
}

export function fromMm(mm: number, unit: Unit): number {
  return mm / MM_PER_UNIT[unit];
}

export function convert(value: number, fromUnit: Unit, toUnit: Unit): number {
  const mm = toMm(value, fromUnit);
  return fromMm(mm, toUnit);
}

export function formatDimension(value: number, unit: Unit): string {
  const rounded = Math.round(value * 100) / 100;
  const suffix = unit === "mm" ? " mm" : unit === "m" ? " m" : unit === "ft" ? " ft" : " in";
  return `${rounded}${suffix}`;
}
