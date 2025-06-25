import { DefaultColors } from 'tailwindcss/types/generated/colors';

export const spacingToRem = (value: number) => {
  return value * 0.25;
};

export type VariableColors = keyof Omit<
  DefaultColors,
  | 'white'
  | 'black'
  | 'transparent'
  | 'inherit'
  | 'lightBlue'
  | 'coolGray'
  | 'blueGray'
  | 'trueGray'
  | 'warmGray'
  | 'current'
>;
