import moment from 'moment';
import { StockData } from '../types';
import { DATE_FORMAT } from '../constants';

const MAIN_FIELD = [
  'symbol',
  'date',
  'change_t0',
  'latestBase',
  't0_over_base_max',
  'estimated_vol_change',
  'closetUpperBase',
  'backtest',
  'expectedReturn',
];

const BACKTEST_FIELD = [
  'date',
  'change_t0',
  'latestBase',
  't0_over_base_max',
  'estimated_vol_change',
  'closetUpperBase',
  'expectedReturn',
];

interface Props {
  isBacktest?: boolean;
  handleClickRow: (record: StockData) => void;
}

const StockTableColumns = ({ handleClickRow, isBacktest }: Props) => {
  const columns = [
    {
      headerName: 'Symbol',
      field: 'symbol',
      width: 120,
    },
    {
      headerName: 'Date',
      field: 'date',
      width: 120,
      onCellClicked: (data: any) => {
        const stockData: StockData = data.data;

        if (!stockData.date) return;
        handleClickRow(stockData as StockData);
      },
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;

        if (!stockData.date) return;
        return moment(stockData.date).format(DATE_FORMAT);
      },
    },
    {
      headerName: 'change_t0',
      field: 'change_t0',
      type: 'rightAligned',
      width: 120,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;

        if (!stockData.change_t0) return;
        return stockData.change_t0.toFixed(1) + '%';
      },
    },
    {
      field: 't0_over_base_max',
      suppressMenu: true,
      width: 120,
      type: 'rightAligned',
      headerName: 't0_over_base_max',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.t0_over_base_max) return;

        return stockData.t0_over_base_max.toFixed(1) + '%';
      },
    },
    {
      field: 'estimated_vol_change',
      suppressMenu: true,
      width: 120,
      type: 'rightAligned',
      headerName: 'estimated_vol_change',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.estimated_vol_change) return;

        return stockData.estimated_vol_change.toFixed(1) + '%';
      },
    },
    {
      field: 'latestBase',
      headerName: 'latestBase',
      type: 'rightAligned',
      width: 150,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.latestBase) return;
        return (
          stockData.latestBase.base_percent.toFixed(1) +
          '%' +
          '|' +
          stockData.latestBase.base_length
        );
      },
    },
    {
      field: 'closetUpperBase',
      suppressMenu: true,
      type: 'rightAligned',
      width: 150,
      headerName: 'closetUpperBase',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.closetUpperBase) return;
        return (
          stockData.closetUpperBase.base_percent.toFixed(1) +
          '%' +
          '|' +
          stockData.closetUpperBase.base_length
        );
      },
    },
    {
      field: 'expectedReturn',
      type: 'rightAligned',
      headerName: 'expectedReturn',
      width: 120,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.closetUpperBase || !stockData.latestBase) return;
        return (
          (
            (100 *
              (stockData.closetUpperBase.base_max -
                stockData.latestBase.base_max)) /
            stockData.latestBase.base_max
          ).toFixed(2) + '%'
        );
      },
    },
    {
      headerName: 'backtest',
      field: 'backtest',
      width: 120,
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
