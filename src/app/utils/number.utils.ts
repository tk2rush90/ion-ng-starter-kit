/**
 * 랜덤 정수 리턴 함수. min, max 값도 포함해서 리턴
 * @param min
 * @param max
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
};
