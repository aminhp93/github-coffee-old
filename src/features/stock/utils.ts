import moment from 'moment';

export const NUMBER_UNIT_REDUCED = 1000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const FULL_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const TIME_FRAME = '1';

export const checkMarketOpen = (): boolean => {
  const currentTime = moment();
  const hour = currentTime.format('H');
  const date = currentTime.format('ddd');
  if (
    parseInt(hour) > 9 &&
    parseInt(hour) < 15 &&
    date !== 'Sun' &&
    date !== 'Sat'
  ) {
    return true;
  }
  return false;
};

export const getStartAndEndTime = () => {
  const start = moment();
  start.set({
    hour: 9,
    minute: 0,
  });

  const end = moment();
  end.set({
    hour: 15,
    minute: 0,
  });
  return { start, end };
};
