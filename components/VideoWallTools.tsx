"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { calculate } from "@/lib/calculator";
import { fromMm, formatDimension, toMm } from "@/lib/units";
import type { ParamKey, Unit } from "@/lib/types";
import { z } from "zod";

export function VideoWallTools() {
  useWebMCP({
    name: "video_wall_calculate",
    description:
      "Calculate the closest lower and upper video wall cabinet configurations. Provide cabinet type (16:9 or 1:1), unit (mm, m, ft, in), exactly two parameters (ar, height, width, diagonal) and their numeric values. For aspect ratio (ar) use decimal e.g. 1.778 for 16:9.",
    inputSchema: {
      cabinetType: z.enum(["16:9", "1:1"]).describe("Cabinet type: 16:9 or 1:1"),
      unit: z
        .enum(["mm", "m", "ft", "in"])
        .describe("Unit for dimension values"),
      param1: z
        .enum(["ar", "height", "width", "diagonal"])
        .describe("First parameter"),
      value1: z.number().describe("Numeric value for first parameter"),
      param2: z
        .enum(["ar", "height", "width", "diagonal"])
        .describe("Second parameter (must differ from param1)"),
      value2: z.number().describe("Numeric value for second parameter"),
    },
    handler: async ({
      cabinetType,
      unit,
      param1,
      value1,
      param2,
      value2,
    }) => {
      if (param1 === param2) {
        return {
          error: "param1 and param2 must be different. Select exactly two parameters.",
        };
      }
      const selectedParams: ParamKey[] = [param1 as ParamKey, param2 as ParamKey];
      const values = {
        ar: null as number | null,
        height: null as number | null,
        width: null as number | null,
        diagonal: null as number | null,
      };
      values[param1 as ParamKey] = value1;
      values[param2 as ParamKey] = value2;

      const unitToMm = (v: number) => toMm(v, unit as Unit);
      const out = calculate(cabinetType, selectedParams, values, unitToMm);

      if (!out) {
        return {
          error:
            "Could not compute. Check inputs (e.g. diagonal must be greater than height and width).",
        };
      }

      const targetW = fromMm(out.targetWidthMm, unit as Unit);
      const targetH = fromMm(out.targetHeightMm, unit as Unit);
      const lines: string[] = [
        `Target: width ${formatDimension(targetW, unit as Unit)}, height ${formatDimension(targetH, unit as Unit)}, aspect ratio ${out.targetAspectRatio.toFixed(2)}.`,
      ];
      if (out.lower) {
        const l = out.lower;
        const lw = fromMm(l.widthMm, unit as Unit);
        const lh = fromMm(l.heightMm, unit as Unit);
        const ld = fromMm(l.diagonalMm, unit as Unit);
        lines.push(
          `Option 1 (Lower): ${l.columns} columns × ${l.rows} rows = ${l.totalCabinets} cabinets. Width ${formatDimension(lw, unit as Unit)}, height ${formatDimension(lh, unit as Unit)}, diagonal ${formatDimension(ld, unit as Unit)}, aspect ratio ${l.aspectRatio.toFixed(2)}.`
        );
      } else {
        lines.push("Option 1 (Lower): No configuration below target.");
      }
      if (out.upper) {
        const u = out.upper;
        const uw = fromMm(u.widthMm, unit as Unit);
        const uh = fromMm(u.heightMm, unit as Unit);
        const ud = fromMm(u.diagonalMm, unit as Unit);
        lines.push(
          `Option 2 (Upper): ${u.columns} columns × ${u.rows} rows = ${u.totalCabinets} cabinets. Width ${formatDimension(uw, unit as Unit)}, height ${formatDimension(uh, unit as Unit)}, diagonal ${formatDimension(ud, unit as Unit)}, aspect ratio ${u.aspectRatio.toFixed(2)}.`
        );
      } else {
        lines.push("Option 2 (Upper): No configuration above target.");
      }
      return { result: lines.join(" ") };
    },
  });

  return null;
}
