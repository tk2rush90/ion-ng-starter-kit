import { getRandomIndex } from './number.utils';

export function stringOrNumberArrayToMap(array: number[]): Record<number, true>;

export function stringOrNumberArrayToMap(array: string[]): Record<string, true>;

export function stringOrNumberArrayToMap(array: string[] | number[]) {
  const map: Record<string | number, true> = {};

  array.forEach((item) => {
    map[item] = true;
  });

  return map;
}

export const pickOne = <T>(arr: T[]) => {
  return arr[getRandomIndex(arr.length)];
};
