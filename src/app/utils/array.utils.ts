import { getRandomIndex } from './number.utils';

export const createMap = <T>(
  arr: readonly T[] | T[],
  key: keyof T,
): { [k: string | number]: T } => {
  const map: { [k: string | number]: T } = {};

  arr.forEach((item) => (map[item[key] as any] = item));

  return map;
};

export const createArrayMap = <T>(
  arr: readonly T[] | T[],
  key: keyof T,
): { [k: string | number]: T[] } => {
  const map: { [k: string | number]: T[] } = {};

  arr.forEach((item) => {
    if (!map[item[key] as any]) {
      map[item[key] as any] = [];
    }

    map[item[key] as any].push(item);
  });

  return map;
};

export const mapToArray = <T>(map: Record<any, T>) => {
  const arr: T[] = [];

  for (const mapKey in map) {
    const item = map[mapKey];

    arr.push(item);
  }

  return arr;
};

export const pickOne = <T>(arr: T[]): T => {
  const randomIndex = getRandomIndex(arr.length);

  return arr[randomIndex];
};
