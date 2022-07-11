export * from './HouseFinance';
export * from './sensor';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const BILLION = 1000000000;
export const MIN_TOTAL_VOLUME = 100000;
export const MIN_TOTAL_VALUE = BILLION * 5;
export const MIN_MEDIUM_TOTOL_VALUE = BILLION * 5;
export const MAX_MEDIUM_TOTOL_VALUE = BILLION * 500;

export const getColumnsFromListData = (data: any) => {
  const columns: any = [];

  data &&
    data.length > 0 &&
    Object.keys(data[0]).map((i: any) => {
      columns.push({
        title: i,
        dataIndex: i,
        key: i,
        render: (item: any) => {
          if (typeof item === 'string' || typeof item === 'number') {
            return item;
          }
          return JSON.stringify(item);
        },
      });
    });

  return columns;
};
