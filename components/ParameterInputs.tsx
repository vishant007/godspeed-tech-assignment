"use client";

import { useCallback, memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ParamKey, Unit } from "@/lib/types";
import { ASPECT_RATIO_PRESETS } from "@/lib/constants";

const PARAM_LABELS: Record<ParamKey, string> = {
  ar: "Aspect ratio",
  height: "Height",
  width: "Width",
  diagonal: "Diagonal",
};

type ParamType = "select" | "input";

interface ParamConfig {
  key: ParamKey;
  label: string;
  type: ParamType;
}

const PARAMETERS: ParamConfig[] = [
  { key: "ar", label: "Aspect ratio", type: "select" },
  { key: "height", label: "Height", type: "input" },
  { key: "width", label: "Width", type: "input" },
  { key: "diagonal", label: "Diagonal", type: "input" },
];

interface ParameterRowProps {
  param: ParamConfig;
  isSelected: boolean;
  canCheck: boolean;
  value: number | null;
  unit: Unit;
  onToggle: () => void;
  onValueChange: (value: number | null) => void;
}

const ParameterRow = memo(function ParameterRow({
  param,
  isSelected,
  canCheck,
  value,
  unit,
  onToggle,
  onValueChange,
}: ParameterRowProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      onValueChange(v === "" ? null : parseFloat(v));
    },
    [onValueChange]
  );

  const handleSelectChange = useCallback(
    (v: string) => {
      const preset = ASPECT_RATIO_PRESETS.find((p) => p.label === v);
      onValueChange(preset ? preset.value : null);
    },
    [onValueChange]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`param-${param.key}`}
          checked={isSelected}
          disabled={!canCheck}
          onCheckedChange={onToggle}
        />
        <Label
          htmlFor={`param-${param.key}`}
          className="font-normal cursor-pointer"
        >
          {param.label}
        </Label>
      </div>
      {isSelected && param.type === "select" && (
        <Select
          value={
            value != null
              ? ASPECT_RATIO_PRESETS.find((p) => Math.abs(p.value - value) < 1e-6)
                  ?.label ?? ""
              : ""
          }
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Choose ratio" />
          </SelectTrigger>
          <SelectContent>
            {ASPECT_RATIO_PRESETS.map((p) => (
              <SelectItem key={p.label} value={p.label}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {isSelected && param.type === "input" && (
        <Input
          type="number"
          min={0}
          step="any"
          placeholder={`Value in ${unit}`}
          className="w-32"
          value={value ?? ""}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
});

interface ParameterInputsProps {
  selectedParams: ParamKey[];
  onToggleParam: (key: ParamKey) => void;
  values: {
    ar: number | null;
    height: number | null;
    width: number | null;
    diagonal: number | null;
  };
  onValueChange: (key: ParamKey, value: number | null) => void;
  unit: Unit;
}

export function ParameterInputs({
  selectedParams,
  onToggleParam,
  values,
  onValueChange,
  unit,
}: ParameterInputsProps) {
  const atMax = selectedParams.length >= 2;
  const isSelected = useCallback(
    (key: ParamKey) => selectedParams.includes(key),
    [selectedParams]
  );
  const canCheck = useCallback(
    (key: ParamKey) => (atMax ? isSelected(key) : true),
    [atMax, isSelected]
  );

  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground text-sm">
        Select exactly two parameters (uncheck one to change selection)
      </Label>

      {PARAMETERS.map((param) => (
        <ParameterRow
          key={param.key}
          param={param}
          isSelected={isSelected(param.key)}
          canCheck={canCheck(param.key)}
          value={values[param.key]}
          unit={unit}
          onToggle={() => onToggleParam(param.key)}
          onValueChange={(value) => onValueChange(param.key, value)}
        />
      ))}
    </div>
  );
}
