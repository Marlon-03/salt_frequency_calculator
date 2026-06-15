// ─── Unit Conversion Helpers

export const gallonsToLiters = (gal: number): number => gal * 3.78541;
export const litersToGallons = (l: number): number => l / 3.78541;
export const kgToLbs = (kg: number): number => kg * 2.20462;
export const lbsToKg = (lbs: number): number => lbs / 2.20462;

// ppt (parts per thousand) ↔ % (parts per hundred)
export const pptToPercent = (ppt: number): number => ppt / 10;
export const percentToPpt = (pct: number): number => pct * 10;

// ─── Forward Calculation

export interface ForwardInput {
  volume: number;
  volumeUnit: "gallons" | "liters";
  currentSalinity: number;
  desiredSalinity: number;
  salinityUnit: "ppt" | "%";
}

export interface ForwardResult {
  saltKg: number;
  saltLbs: number;
  volumeLiters: number;
  volumeGallons: number;
  deltaPpt: number;
}

export function calcSaltToAdd(input: ForwardInput): ForwardResult {
  const { volume, volumeUnit, currentSalinity, desiredSalinity, salinityUnit } = input;

  const volumeLiters = volumeUnit === "gallons" ? gallonsToLiters(volume) : volume;
  const volumeGallons = volumeUnit === "liters" ? litersToGallons(volume) : volume;

  const currentPpt = salinityUnit === "%" ? percentToPpt(currentSalinity) : currentSalinity;
  const desiredPpt = salinityUnit === "%" ? percentToPpt(desiredSalinity) : desiredSalinity;
  const deltaPpt = desiredPpt - currentPpt;

  // Primary (metric)
  const saltKg = (volumeLiters * deltaPpt) / 1000;
  const saltLbs = saltKg > 0 ? kgToLbs(saltKg) : 0;

  return {
    saltKg: Math.max(0, saltKg),
    saltLbs: Math.max(0, saltLbs),
    volumeLiters,
    volumeGallons,
    deltaPpt,
  };
}

// ─── Reverse Calculation

export interface ReverseInput {
  saltAdded: number;
  saltUnit: "lbs" | "kg";
  salinityChange: number;
  salinityUnit: "ppt" | "%";
}

export interface ReverseResult {
  volumeGallons: number;
  volumeLiters: number;
}

export function calcPondVolume(input: ReverseInput): ReverseResult {
  const { saltAdded, saltUnit, salinityChange, salinityUnit } = input;

  const saltLbs = saltUnit === "kg" ? kgToLbs(saltAdded) : saltAdded;
  const salinityPct = salinityUnit === "ppt" ? pptToPercent(salinityChange) : salinityChange;

  if (salinityPct <= 0) return { volumeGallons: 0, volumeLiters: 0 };

  const volumeGallons = saltLbs / (8.34 * (salinityPct / 100));
  const volumeLiters = gallonsToLiters(volumeGallons);

  return {
    volumeGallons: Math.max(0, volumeGallons),
    volumeLiters: Math.max(0, volumeLiters),
  };
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export function validateForwardInputs(input: Partial<ForwardInput>): ValidationError[] {
  const errors: ValidationError[] = [];
  const { volume, currentSalinity, desiredSalinity, salinityUnit } = input;

  if (volume !== undefined) {
    if (volume <= 0) errors.push({ field: "volume", message: "Pond volume must be greater than 0.", severity: "error" });
    if (volume > 10_000_000) errors.push({ field: "volume", message: "That's an unusually large volume — double-check your entry.", severity: "warning" });
  }

  const maxPpt = salinityUnit === "%" ? 3.5 : 35;
  const dangerPpt = salinityUnit === "%" ? 1.5 : 15;

  if (currentSalinity !== undefined && currentSalinity < 0) {
    errors.push({ field: "currentSalinity", message: "Salinity can't be negative.", severity: "error" });
  }
  if (desiredSalinity !== undefined && desiredSalinity < 0) {
    errors.push({ field: "desiredSalinity", message: "Salinity can't be negative.", severity: "error" });
  }

  if (currentSalinity !== undefined && desiredSalinity !== undefined) {
    if (desiredSalinity < currentSalinity) {
      errors.push({
        field: "desiredSalinity",
        message: "Desired salinity is lower than current — you'd need to dilute with fresh water, not add salt.",
        severity: "warning",
      });
    }
    if (desiredSalinity === currentSalinity) {
      errors.push({ field: "desiredSalinity", message: "Desired salinity equals current — no salt needed.", severity: "warning" });
    }
    if (desiredSalinity > dangerPpt) {
      errors.push({
        field: "desiredSalinity",
        message: `Salinity above ${dangerPpt}${salinityUnit} can be harmful to Koi. Typical treatment range is 0.3–0.6%.`,
        severity: "warning",
      });
    }
    if (desiredSalinity > maxPpt) {
      errors.push({ field: "desiredSalinity", message: "This exceeds ocean salinity — please verify your values.", severity: "error" });
    }
  }

  return errors;
}

export function validateReverseInputs(input: Partial<ReverseInput>): ValidationError[] {
  const errors: ValidationError[] = [];
  const { saltAdded, salinityChange } = input;

  if (saltAdded !== undefined && saltAdded <= 0) {
    errors.push({ field: "saltAdded", message: "Amount of salt added must be greater than 0.", severity: "error" });
  }
  if (salinityChange !== undefined && salinityChange <= 0) {
    errors.push({ field: "salinityChange", message: "Salinity change must be greater than 0.", severity: "error" });
  }

  return errors;
}

// ─── Formatting Helpers

export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
