import { useEffect, useState } from 'react';

export const UNITS = {
  d: 'days',
  w: 'weeks',
  m: 'months',
  y: 'years'
} as const;

export type SupportedUnit = keyof typeof UNITS;

const unit_arr = Array.from(Object.keys(UNITS));
export function checkUnit(input: string): input is SupportedUnit {
  return unit_arr.includes(input);
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// change the value with delay
// only triggers when user the stops typing for specific delay
export function useDebounce(value: unknown, delay: number) { 
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value)
    }, delay);

    return () => {
      clearTimeout(handler);
    }
  }, [value, delay])

  return debounceValue;
}
