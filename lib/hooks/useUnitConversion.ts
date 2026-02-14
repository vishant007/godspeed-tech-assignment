import { useCallback } from "react";
import { convert, toMm } from "@/lib/units";
import type { Unit } from "@/lib/types";

export function useUnitConversion(unit: Unit) {
  const unitToMm = useCallback(
    (value: number) => toMm(value, unit),
    [unit]
  );

  const convertValue = useCallback(
    (value: number | null, fromUnit: Unit, toUnit: Unit) => {
      return value != null ? convert(value, fromUnit, toUnit) : null;
    },
    []
  );

  return { unitToMm, convertValue };
}
