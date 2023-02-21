import moment from 'moment';
import { DATE_FORMAT } from '../constants';
import { StockData } from '../types';
import { evaluateStockBase, getMinTotalValue, getColorStock } from '../utils';

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
  return [
    {
      headerName: '',
      field: 'symbol',
      width: 80,
      onCellClicked: (data: any) => {
        handleClickSymbol && handleClickSymbol(data);
      },
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.date) return;
        return stockData.symbol;
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
      headerName: 't0',
      field: 'change_t0',
      type: 'rightAligned',
      width: 90,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.change_t0 && stockData.change_t0 !== 0) return;
        return (
          <div
            style={{
              color: getColorStock(stockData),
            }}
          >
            {stockData.change_t0.toFixed(1) + '%'}
          </div>
        );
      },
    },
    {
      field: 'estimated_vol_change',
      suppressMenu: true,
      width: 90,
      type: 'rightAligned',
      headerName: 'vol_t0',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.estimated_vol_change) return;

        return (
          <div
            style={{
              color: stockData.estimated_vol_change > 0.5 ? '#00aa00' : '',
            }}
          >
            {stockData.estimated_vol_change.toFixed(1) + '%'}
          </div>
        );
      },
    },
    {
      headerName: 'target',
      field: 'target',
      type: 'rightAligned',
      width: 100,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;

        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        const { target, risk_b2, risk_b1 } = evaluateStockBase(
          filter[0],
          stockData.fullData
        );
        if (!target) return;
        let color = '';
        if (risk_b2 && target > risk_b2) {
          color = '#00aa00';
        } else if (!risk_b2 && risk_b1 && target > risk_b1) {
          color = '#00aa00';
        } else if (target < 0) {
          color = '#ee5442';
        }

        return (
          <div
            style={{
              color,
            }}
          >
            {target && target.toFixed(0) + '%'}
          </div>
        );
      },
    },
    {
      headerName: 'risk_b2',
      field: 'risk_b2',
      type: 'rightAligned',
      width: 100,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        const { risk_b2 } = evaluateStockBase(filter[0], stockData.fullData);
        if (!risk_b2) return;
        return risk_b2 && risk_b2.toFixed(0) + '%';
      },
    },
    {
      headerName: 'risk_b1',
      field: 'risk_b1',
      type: 'rightAligned',
      width: 100,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        const { risk_b1 } = evaluateStockBase(filter[0], stockData.fullData);
        if (!risk_b1) return;
        return risk_b1 && risk_b1.toFixed(0) + '%';
      },
    },
    {
      field: 'min_total_value',
      suppressMenu: true,
      type: 'rightAligned',
      headerName: 'min_total_value',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;

        const { minTotal, maxTotal, averageTotal } =
          getMinTotalValue(stockData);
        return `${minTotal} - ${maxTotal} - ${averageTotal}`;
      },
    },
    {
      field: 'extra_volume',
      suppressMenu: true,
      type: 'rightAligned',
      headerName: 'extra_volume',
      width: 120,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        const extra = stockData.totalVolume - stockData.dealVolume;
        if (!extra) return;
        const percent_extra = (100 * extra) / stockData.dealVolume;

        return `${percent_extra.toFixed(0)}% (${extra}/${
          stockData.dealVolume
        })`;
      },
    },
  ];
};

export default StockTableColumns;
