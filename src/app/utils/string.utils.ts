import { getRandomIndex } from './number.utils';

export const createRandomUnique = (size = 12) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let uniqueId = '';

  for (let i = 0; i < size; i++) {
    uniqueId += characters.charAt(getRandomIndex(characters.length));
  }

  return uniqueId;
};

export const toTitleCase = (text: string) => {
  return text[0].toUpperCase() + text.slice(1);
};
