import moment from 'moment';
import { StockData } from '../types';
import { DATE_FORMAT } from '../constants';
import { evaluateStockBase } from '../utils';

const MAIN_FIELD = [
  'symbol',
  'date',
  'change_t0',
  // 'latestBase',
  // 't0_over_base_max',
  'estimated_vol_change',
  // 'closetUpperBase',
  'backtest',
  // 'expectedReturn',
  'risk',
  'target',
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
  handleClickSymbol?: (record: StockData) => void;
  handleClickBacktest?: (record: StockData) => void;
  handleClickDate?: (record: StockData) => void;
  listStockBase?: any;
}

const StockTableColumns = ({
  handleClickSymbol,
  handleClickBacktest,
  handleClickDate,
  isBacktest,
  listStockBase,
}: Props) => {
  const columns = [
    {
      headerName: 'Symbol',
      field: 'symbol',
      width: 120,
      onCellClicked: (data: any) => {
        handleClickSymbol && handleClickSymbol(data);
      },
    },
    {
      headerName: 'Date',
      field: 'date',
      hide: true,
      width: 120,
      onCellClicked: (data: any) => {
        handleClickDate && handleClickDate(data);
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
      width: 150,
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
      width: 150,
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
      headerName: 'risk',
      field: 'risk',
      type: 'rightAligned',
      width: 150,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!listStockBase) return;

        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        if (!stockData.change_t0) return;
        const { risk } = evaluateStockBase(filter[0], stockData.fullData);
        return risk && risk.toFixed(0) + '%';
      },
    },
    {
      headerName: 'target',
      field: 'target',
      type: 'rightAligned',
      width: 150,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        if (!listStockBase) return;

        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        if (!stockData.change_t0) return;
        const { target } = evaluateStockBase(filter[0], stockData.fullData);
        return target && target.toFixed(0) + '%';
      },
    },
    {
      headerName: 'backtest',
      field: 'backtest',
      hide: true,
      width: 120,
      cellRenderer: () => {
        return 'backtest';
      },
      onCellClicked: (data: any) => {
        handleClickBacktest && handleClickBacktest(data);
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
