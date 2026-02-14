"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Unit } from "@/lib/types";

const UNIT_LABELS: Record<Unit, string> = {
  mm: "Millimeters (mm)",
  m: "Meters (m)",
  ft: "Feet (ft)",
  in: "Inches (in)",
};

interface UnitSelectorProps {
  value: Unit;
  onChange: (value: Unit) => void;
}

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Unit</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Unit)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select unit" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5} className="z-[100]">
          {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
            <SelectItem key={u} value={u}>
              {UNIT_LABELS[u]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
