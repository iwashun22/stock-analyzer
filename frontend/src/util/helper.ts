
export const UNITS = {
  w: 'weeks',
  m: 'months',
  y: 'years'
} as const;

export type SupportedUnit = keyof typeof UNITS;

const unit_arr = Array.from(Object.keys(UNITS));
export function checkUnit(input: string): input is SupportedUnit {
  return unit_arr.includes(input);
}
