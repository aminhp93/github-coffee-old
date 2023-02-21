import moment from 'moment';
import { minBy, maxBy, min, max } from 'lodash';
import { Filter, StockCoreData } from './types';

export const UNIT_BILLION = 1_000_000_000;
export const NUMBER_UNIT_REDUCED = 1000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const FULL_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const TIME_FRAME = '1';
export const DELAY_TIME = 1_000 * 60;
export const MIN_TOTAL_VOLUME = 100_000;
export const MIN_TOTAL_VALUE = UNIT_BILLION * 5;
export const MIN_MEDIUM_TOTOL_VALUE = UNIT_BILLION * 5;
export const MIN_CHANGE = -1000;
export const MAX_CHANGE = 1000;
export const MAX_PERCENT_BASE = 10;
export const DEFAULT_DATE = moment();
export const DEFAULT_START_DATE = moment().add(-40, 'days');
export const DEFAULT_END_DATE =
  moment().format('HH:mm') > '15:00' ? moment() : moment().add(-1, 'days');

export const DEFAULT_FILTER: Filter = {
  change_t0: 2,
  estimated_vol_change: 20,
  t0_over_base_max: 0.1,
};

export const DEFAULT_SETTING: any = {
  bordered: true,
  size: 'small',
  showHeader: true,
  showSorterTooltip: false,
  pagination: {
    position: ['bottomRight'],
    pageSizeOptions: ['10', '20', '100'],
    showSizeChanger: true,
  },
};

export const getMaxPercentBase = (symbol: string) => {
  if (['MBS'].includes(symbol)) {
    return 10;
  } else if (['BSR'].includes(symbol)) {
    return 15;
  } else {
    return 7;
  }
};

export const getEstimatedVol = (data: StockCoreData) => {
  if (data.date === moment().format(DATE_FORMAT)) {
    // from 9:00 to 11:30
    const morning_time = 60 * 2.5;

    // from 13:00 to 14:45
    const afternoon_time = 60 * 1.75;

    const total_time = morning_time + afternoon_time;
    const current_time = moment().format('HH:mm');
    let estimated_vol;

    if (current_time < '09:00') {
      estimated_vol = 0;
    } else if (current_time >= '09:00' && current_time <= '11:30') {
      const diff_time = moment(current_time, 'HH:mm').diff(
        moment('09:00', 'HH:mm'),
        'minute'
      );
      estimated_vol = data.totalVolume * (total_time / diff_time);
    } else if (current_time >= '11:31' && current_time <= '12:59') {
      estimated_vol = data.totalVolume * (total_time / morning_time);
    } else if (current_time >= '13:00' && current_time <= '14:45') {
      const diff_time = moment(current_time, 'HH:mm').diff(
        moment('13:00', 'HH:mm'),
        'minute'
      );
      estimated_vol =
        data.totalVolume * (total_time / (morning_time + diff_time));
    } else {
      estimated_vol = data.totalVolume;
    }
    return estimated_vol;
  }

  return data.totalVolume;
};

export const getBase_min_max = (data: StockCoreData[]) => {
  return {
    base_min: min([
      minBy(data, 'priceOpen')?.priceOpen,
      minBy(data, 'priceClose')?.priceClose,
    ]),
    base_max: max([
      maxBy(data, 'priceOpen')?.priceOpen,
      maxBy(data, 'priceClose')?.priceClose,
    ]),
  };
};
