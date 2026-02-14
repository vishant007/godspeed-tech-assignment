"use client";

import { useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CabinetSelector } from "@/components/CabinetSelector";
import { ParameterInputs } from "@/components/ParameterInputs";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { UnitSelector } from "@/components/UnitSelector";
import { VideoWallTools } from "@/components/VideoWallTools";
import { WebMCPProvider } from "@/components/WebMCPProvider";
import { convert, fromMm, formatDimension } from "@/lib/units";
import { useUnitConversion } from "@/lib/hooks/useUnitConversion";
import { useVideoWallCalculator } from "@/lib/hooks/useVideoWallCalculator";
import type { Unit } from "@/lib/types";

export default function Home() {
  const [cabinetType, setCabinetType] = useState<"16:9" | "1:1">("16:9");
  const [unit, setUnit] = useState<Unit>("in");

  const { unitToMm, convertValue } = useUnitConversion(unit);

  const {
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
  } = useVideoWallCalculator(cabinetType, unitToMm);

  const handleUnitChange = useCallback(
    (newUnit: Unit) => {
      setValues((prev) => ({
        ...prev,
        height: convertValue(prev.height, unit, newUnit),
        width: convertValue(prev.width, unit, newUnit),
        diagonal: convertValue(prev.diagonal, unit, newUnit),
      }));
      setUnit(newUnit);
    },
    [unit, convertValue, setValues]
  );

  return (
    <WebMCPProvider>
      <VideoWallTools />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Video Wall Size Calculator
          </h1>
          <p className="text-muted-foreground text-sm">
            Select cabinet type, choose exactly two parameters, and get the
            closest lower and upper configurations.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Choose cabinet type, unit, and exactly two parameters with values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CabinetSelector value={cabinetType} onChange={setCabinetType} />
            <UnitSelector value={unit} onChange={handleUnitChange} />
            <ParameterInputs
              selectedParams={selectedParams}
              onToggleParam={handleToggleParam}
              values={values}
              onValueChange={handleValueChange}
              unit={unit}
            />
            <Button onClick={handleApply} disabled={!canApply}>
              Apply
            </Button>
            {calcError && (
              <p className="text-destructive text-sm">{calcError}</p>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Closest lower and upper cabinet configurations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsDisplay
                lower={result.lower}
                upper={result.upper}
                targetWidthMm={result.targetWidthMm}
                targetHeightMm={result.targetHeightMm}
                targetAspectRatio={result.targetAspectRatio}
                unit={unit}
                selectedConfig={selectedConfig}
                onSelectConfig={(config) => setSelectedConfig(config)}
              />
            </CardContent>
          </Card>
        )}

        {selectedConfig && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Selected configuration</CardTitle>
              <CardDescription>
                Your chosen cabinet layout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>{selectedConfig.columns}</strong> columns ×{" "}
                <strong>{selectedConfig.rows}</strong> rows ={" "}
                <strong>{selectedConfig.totalCabinets}</strong> cabinets
              </p>
              <p className="text-muted-foreground">
                Width: {formatDimension(fromMm(selectedConfig.widthMm, unit), unit)}
                {" · "}
                Height: {formatDimension(fromMm(selectedConfig.heightMm, unit), unit)}
                {" · "}
                Diagonal: {formatDimension(fromMm(selectedConfig.diagonalMm, unit), unit)}
                {" · "}
                Aspect ratio: {selectedConfig.aspectRatio.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </WebMCPProvider>
  );
}
