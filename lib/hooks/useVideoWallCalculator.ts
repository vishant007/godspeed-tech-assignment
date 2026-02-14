import { useCallback, useState, useMemo } from "react";
import { calculate } from "@/lib/calculator";
import type { ConfigResult, ParamKey, Unit } from "@/lib/types";

interface CalculatorValues {
  ar: number | null;
  height: number | null;
  width: number | null;
  diagonal: number | null;
}

interface CalculatorResult {
  lower: ConfigResult | null;
  upper: ConfigResult | null;
  targetWidthMm: number;
  targetHeightMm: number;
  targetAspectRatio: number;
}

export function useVideoWallCalculator(
  cabinetType: "16:9" | "1:1",
  unitToMm: (value: number) => number
) {
  const [selectedParams, setSelectedParams] = useState<ParamKey[]>([]);
  const [values, setValues] = useState<CalculatorValues>({
    ar: null,
    height: null,
    width: null,
    diagonal: null,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ConfigResult | null>(null);

  const handleToggleParam = useCallback((key: ParamKey) => {
    setSelectedParams((prev) => {
      if (prev.includes(key)) {
        return prev.filter((p) => p !== key);
      }
      if (prev.length >= 2) return prev;
      const next = [...prev, key];
      if (key === "ar") {
        setValues((v) => ({ ...v, ar: v.ar ?? 16 / 9 }));
      }
      return next;
    });
  }, []);

  const handleValueChange = useCallback((key: ParamKey, value: number | null) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canApply = useMemo(() =>
    selectedParams.length === 2 &&
    selectedParams.every((p) => {
      const v = values[p as keyof typeof values];
      return v != null && (p === "ar" ? true : !Number.isNaN(v) && v > 0);
    }),
    [selectedParams, values]
  );

  const handleApply = useCallback(() => {
    if (!canApply) return;
    setCalcError(null);
    const out = calculate(
      cabinetType,
      selectedParams,
      values,
      unitToMm
    );
    if (out) {
      setResult({
        lower: out.lower,
        upper: out.upper,
        targetWidthMm: out.targetWidthMm,
        targetHeightMm: out.targetHeightMm,
        targetAspectRatio: out.targetAspectRatio,
      });
      setSelectedConfig(null);
    } else {
      setResult(null);
      const hasDiag =
        selectedParams.includes("diagonal") &&
        (selectedParams.includes("height") || selectedParams.includes("width"));
      setCalcError(
        hasDiag
          ? "Invalid: diagonal must be greater than height and width."
          : "Could not compute. Check your inputs."
      );
    }
  }, [cabinetType, selectedParams, values, unitToMm, canApply]);

  return {
    selectedParams,
    values,
    result,
    calcError,
    selectedConfig,
    canApply,
    handleToggleParam,
    handleValueChange,
    handleApply,
    setSelectedConfig,
    setValues,
  };
}
