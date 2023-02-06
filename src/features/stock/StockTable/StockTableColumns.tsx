import moment from 'moment';
import { ResultBacktestData } from '../types';
import { DATE_FORMAT } from '../constants';

const MAIN_FIELD = [
  'symbol',
  'change_t0',
  'base_percent',
  't0_over_base_max',
  'estimated_vol_change',
  'diff_closet_upper_base',
  'backtest',
];

const BACKTEST_FIELD = [
  'date',
  'change_t0',
  'base_percent',
  't0_over_base_max',
  'estimated_vol_change',
  'diff_closet_upper_base',
];

interface Props {
  isBacktest?: boolean;
  handleClickRow: (record: ResultBacktestData) => void;
}

const StockTableColumns = ({ handleClickRow, isBacktest }: Props) => {
  const columns = [
    {
      headerName: 'Symbol',
      field: 'symbol',
    },
    {
      headerName: 'Date',
      field: 'date',
      onCellClicked: (data: any) => {
        if (!data.data.date) return;
        handleClickRow(data.data as ResultBacktestData);
      },
      cellRenderer: (data: any) => {
        if (!data.data.date) return;
        return moment(data.data.date).format(DATE_FORMAT);
      },
    },
    {
      headerName: 'change_t0',
      field: 'change_t0',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!data.data.change_t0) return;
        return data.data.change_t0.toFixed(1) + '%';
      },
    },
    {
      field: 'base_percent',
      headerName: 'base_percent',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!data.data.latestBase) return;
        return data.data.latestBase.base_percent.toFixed(1) + '%';
      },
    },
    {
      field: 't0_over_base_max',
      suppressMenu: true,
      headerName: 't0_over_base_max',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!data.data.t0_over_base_max) return;
        return data.data.t0_over_base_max.toFixed(1) + '%';
      },
    },
    {
      field: 'estimated_vol_change',
      suppressMenu: true,
      headerName: 'estimated_vol_change',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!data.data.estimated_vol_change) return;
        return data.data.estimated_vol_change.toFixed(1) + '%';
      },
    },
    {
      field: 'diff_closet_upper_base',
      suppressMenu: true,
      headerName: 'diff_closet_upper_base',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!data.data.closetUpperBase || !data.data.latestBase) return;
        return (
          (
            (100 *
              (data.data.closetUpperBase.base_max -
                data.data.latestBase.base_max)) /
            data.data.latestBase.base_max
          ).toFixed(2) + '%'
        );
      },
    },
    {
      headerName: 'backtest',
      field: 'backtest',
      cellRenderer: () => {
        return 'backtest';
      },
      onCellClicked: (data: any) => {
        handleClickRow(data);
      },
    },
  ];
  let field = MAIN_FIELD;
  if (isBacktest) {
    field = BACKTEST_FIELD;
  }

  return columns.filter((i) => field.includes(i.field));
};

export default StockTableColumns;
