# Video Wall Calculator – Spec Compliance Checklist

## Objective & Core Requirements

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| Allow users to select cabinet type | Done | `CabinetSelector` – RadioGroup for 16:9 and 1:1 |
| Allow users to input exactly two parameters at a time | Done | `ParameterInputs` – checkboxes; when 2 selected, others disabled |
| Calculate and display closest lower and upper cabinet configurations | Done | `lib/calculator.ts` + `ResultsDisplay` |
| Display rows and columns visually (simple grid diagram) | Done | `GridDiagram` – rectangular grid, capped at 24×24 for display |
| Support unit conversion (mm, m, ft, in) | Done | `UnitSelector` + `lib/units.ts` (MM_PER_UNIT, convert) |

## Cabinet Types

| Cabinet | Width | Height | AR | Status |
|---------|-------|--------|-----|--------|
| 16:9 | 600 mm | 337.5 mm | 16:9 | Done in `lib/constants.ts` |
| 1:1 | 500 mm | 500 mm | 1.0 | Done in `lib/constants.ts` |

## User Inputs

| Requirement | Status |
|-------------|--------|
| Aspect ratio (preset only; no custom) | Done – presets: 16:9, 16:10, 4:3, 1:1, 21:9 |
| Height, Width, Diagonal | Done – each has checkbox + input when selected |
| Only two parameters at a time | Done – `canCheck` disables unselected when 2 selected |
| Must unselect one to change selection | Done – user must uncheck before checking another |
| Valid pairs: AR+Height, AR+Width, AR+Diagonal, Height+Width, Height+Diagonal, Width+Diagonal | Done – `deriveTargetDimensions` handles all 6 |

## Unit Toggle

| Requirement | Status |
|-------------|--------|
| Millimeters, Meters, Feet, Inches | Done |
| On unit change: entered values convert automatically | Done – `handleUnitChange` converts height, width, diagonal |
| On unit change: displayed results update | Done – results stored in mm; display uses current `unit` |

## Core Logic

| Requirement | Status |
|-------------|--------|
| Closest configuration **below** requested size | Done – `isLower` (≤ target), best by combined dimension + AR score |
| Closest configuration **above** requested size | Done – `isUpper` (≥ target; strictly above when exact match exists) |
| If exact match: that match = “size lower”, next larger = “size upper” | Done – `hasExactMatch` forces upper to be strictly larger when there is an exact match |
| Choose by both dimension accuracy and aspect ratio accuracy | Done – `score()` combines normalized dimension error and AR error |

## Example Scenarios

| Scenario | Status |
|----------|--------|
| 1: AR 16:9 + Height 100 in → convert to mm, rows, AR check, lower/upper | Done – `deriveTargetDimensions` + convergents + floor/ceil candidates |
| 2: 1:1 cabinets, AR 16:9, Height 100 in → closest achievable ratio (e.g. 1.8), still lower/upper | Done – actual aspect ratio shown per config; 1:1 uses same logic |
| 3: Width 100 in + Diagonal 200 in → implied height, grid combos, lower/upper | Done – `width + diagonal` branch in `deriveTargetDimensions` |

## Output Requirements

| Per-option display | Status |
|--------------------|--------|
| Number of columns | Done – ConfigCard |
| Number of rows | Done – ConfigCard |
| Total cabinet count | Done – ConfigCard |
| Final width, height, diagonal | Done – in selected unit |
| Final aspect ratio | Done – 2 decimal places |
| User’s input values clearly | Done – “Target: W … H … AR …” |
| Whether result is lower or upper | Done – “Option 1 (lower)” / “Option 2 (upper)” |

## Visual Display

| Requirement | Status |
|-------------|--------|
| Simple grid diagram with columns × rows | Done – `GridDiagram` |
| No arrows or decorative elements | Done – rectangles only |

## Behavior Rules

| Requirement | Status |
|-------------|--------|
| Only two inputs active at a time | Done |
| Unit conversion on change | Done |
| Closest lower and upper required | Done |
| Exact match handled (lower = match, upper = next larger) | Done |
| Both cabinet types supported | Done |
| User can select a configuration and confirm | Done – “Select” on each option |
| Once selected, show final chosen dimensions clearly | Done – “Selected configuration” card |

## Edge Cases

| Edge case | Status |
|-----------|--------|
| No exact aspect ratio possible (e.g. 16:9 target with 1:1 cabinets) | Done – show actual ratio per config |
| Very small sizes | Done – MIN_ROWS/MIN_COLS = 1 |
| Very large sizes | Done – no hard cap; grid diagram capped at 24×24 |
| Decimal precision | Done – `formatDimension` rounds to 2 decimals |
| Unit switching after results shown | Done – results in mm; display uses current unit |

## Deliverables (your side)

| Deliverable | Note |
|-------------|------|
| Working hosted demo link | Deploy (e.g. Vercel) and add link |
| Source code repository | This repo |
| Loom: how AI was used | For you to record |
| Loom: calculation logic, lower/upper, aspect ratio, time | For you to record |

## Notes

- Custom aspect ratio: not implemented (per spec).
- Arrow graphics: not used (per spec).
- Calculation uses continued-fraction convergents for best N/M ratio when aspect ratio is one of the two inputs, plus floor/ceil dimension-based candidates.
