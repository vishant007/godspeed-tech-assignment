"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CabinetType } from "@/lib/types";

interface CabinetSelectorProps {
  value: CabinetType;
  onChange: (value: CabinetType) => void;
}

export function CabinetSelector({ value, onChange }: CabinetSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Cabinet type</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as CabinetType)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="16:9" id="cab-16-9" />
          <Label htmlFor="cab-16-9" className="font-normal cursor-pointer">
            16:9 (600 × 337.5 mm)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="1:1" id="cab-1-1" />
          <Label htmlFor="cab-1-1" className="font-normal cursor-pointer">
            1:1 (500 × 500 mm)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
