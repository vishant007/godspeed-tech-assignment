"use client";

import { cn } from "@/lib/utils";
import { MAX_GRID_DISPLAY } from "@/lib/constants";

interface GridDiagramProps {
  columns: number;
  rows: number;
  className?: string;
}

export function GridDiagram({ columns, rows, className }: GridDiagramProps) {
  const capCols = Math.min(columns, MAX_GRID_DISPLAY);
  const capRows = Math.min(rows, MAX_GRID_DISPLAY);
  const cellSize = Math.max(8, Math.min(24, 200 / Math.max(capCols, capRows)));

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <p className="text-muted-foreground text-sm">
        {columns} columns × {rows} rows
        {(columns > MAX_GRID_DISPLAY || rows > MAX_GRID_DISPLAY) && (
          <span className="ml-1">(showing first {capCols}×{capRows})</span>
        )}
      </p>
      <div
        className="flex flex-wrap gap-px border border-border rounded p-1 bg-muted/30"
        style={{
          width: capCols * cellSize + 8,
          height: capRows * cellSize + 8,
        }}
      >
        {Array.from({ length: capRows * capCols }).map((_, i) => (
          <div
            key={i}
            className="bg-primary/80 rounded-sm shrink-0"
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
