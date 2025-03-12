export const WEEK_DAYS: Record<string, readonly string[]> = {
  koShort: ['일', '월', '화', '수', '목', '금', '토'],
  koFull: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  enInitial: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  enShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  enFull: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
};

export const createCalendarDates = (year: number, month: number): Date[] => {
  const dates = [];

  const displayDateObject = new Date(year, month, 1);

  const displayStartDay = displayDateObject.getDay();

  const startDateObject = new Date(year, month, 1 - displayStartDay);

  const startYear = startDateObject.getFullYear();
  const startMonth = startDateObject.getMonth();
  const startDate = startDateObject.getDate();

  for (let i = startDate; i < startDate + 42; i++) {
    dates.push(new Date(startYear, startMonth, i));
  }

  return dates;
};

export const getYesterday = (date: Date | string): Date => {
  const today = new Date(date);

  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
};

export const getTomorrow = (date: Date | string): Date => {
  const today = new Date(date);

  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
};

export const isDatePassed = (date: Date, targetDate: Date): boolean => {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);

  targetDate = new Date(targetDate);
  targetDate.setHours(0, 0, 0, 0);

  return date > targetDate;
};
