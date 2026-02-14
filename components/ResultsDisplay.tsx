"use client";

import { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GridDiagram } from "@/components/GridDiagram";
import type { ConfigResult, ResultKind, Unit } from "@/lib/types";
import { fromMm, formatDimension } from "@/lib/units";

interface ConfigCardProps {
  config: ConfigResult;
  kind: ResultKind;
  unit: Unit;
  isSelected: boolean;
  onSelect: () => void;
}

const ConfigCard = memo(function ConfigCard({
  config,
  kind,
  unit,
  isSelected,
  onSelect,
}: ConfigCardProps) {
  const dimensions = useMemo(
    () => ({
      width: fromMm(config.widthMm, unit),
      height: fromMm(config.heightMm, unit),
      diagonal: fromMm(config.diagonalMm, unit),
    }),
    [config.widthMm, config.heightMm, config.diagonalMm, unit]
  );

  return (
    <Card className={isSelected ? "ring-2 ring-primary" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Option {kind === "lower" ? "1" : "2"} ({kind})
        </CardTitle>
        <CardDescription>
          {config.columns} columns × {config.rows} rows · {config.totalCabinets}{" "}
          cabinets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>Width: {formatDimension(dimensions.width, unit)}</li>
          <li>Height: {formatDimension(dimensions.height, unit)}</li>
          <li>Diagonal: {formatDimension(dimensions.diagonal, unit)}</li>
          <li>Aspect ratio: {config.aspectRatio.toFixed(2)}</li>
        </ul>
        <GridDiagram columns={config.columns} rows={config.rows} />
        <Button
          variant={isSelected ? "secondary" : "outline"}
          size="sm"
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardContent>
    </Card>
  );
});

interface ResultsDisplayProps {
  lower: ConfigResult | null;
  upper: ConfigResult | null;
  targetWidthMm: number;
  targetHeightMm: number;
  targetAspectRatio: number;
  unit: Unit;
  selectedConfig: ConfigResult | null;
  onSelectConfig: (config: ConfigResult, kind: ResultKind) => void;
}

export function ResultsDisplay({
  lower,
  upper,
  targetWidthMm,
  targetHeightMm,
  targetAspectRatio,
  unit,
  selectedConfig,
  onSelectConfig,
}: ResultsDisplayProps) {
  const isConfigSelected = useCallback(
    (config: ConfigResult) =>
      selectedConfig !== null &&
      selectedConfig.columns === config.columns &&
      selectedConfig.rows === config.rows,
    [selectedConfig]
  );

  const targetDimensions = useMemo(
    () => ({
      width: formatDimension(fromMm(targetWidthMm, unit), unit),
      height: formatDimension(fromMm(targetHeightMm, unit), unit),
      aspectRatio: targetAspectRatio.toFixed(2),
    }),
    [targetWidthMm, targetHeightMm, targetAspectRatio, unit]
  );

  const emptyStateMessage = useMemo(() => {
    if (!lower && !upper) return "No configurations found. Try different inputs.";
    if (!lower) return "No lower configuration (target may be very small).";
    return "No upper configuration (target may be very large).";
  }, [lower, upper]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Target: W {targetDimensions.width}, H {targetDimensions.height}, AR{" "}
        {targetDimensions.aspectRatio}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {lower && (
          <ConfigCard
            config={lower}
            kind="lower"
            unit={unit}
            isSelected={isConfigSelected(lower)}
            onSelect={() => onSelectConfig(lower, "lower")}
          />
        )}
        {upper && (
          <ConfigCard
            config={upper}
            kind="upper"
            unit={unit}
            isSelected={isConfigSelected(upper)}
            onSelect={() => onSelectConfig(upper, "upper")}
          />
        )}
      </div>
      {(!lower || !upper) && (
        <p className="text-muted-foreground text-sm">{emptyStateMessage}</p>
      )}
    </div>
  );
}
