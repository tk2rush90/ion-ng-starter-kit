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

export type ColorWeight =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';
