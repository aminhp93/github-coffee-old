import dayjs from 'dayjs';
import { DATE_FORMAT } from '../constants';
import { StockData } from '../types';
import { evaluateStockBase, getColorStock, getMinTotalValue } from '../utils';

interface Props {
  handleClickSymbol?: (record: StockData) => void;
  listStockBase?: any;
}

const StockTableColumns = ({ handleClickSymbol, listStockBase }: Props) => {
  return [
    {
      headerName: '',
      field: 'symbol',
      suppressMenu: true,
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
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.date) return;
        return dayjs(stockData.date).format(DATE_FORMAT);
      },
    },
    {
      headerName: 'P (%)',
      field: 'change_t0',
      type: 'rightAligned',
      suppressMenu: true,
      width: 74,
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
            {stockData.change_t0.toFixed(1)}
          </div>
        );
      },
    },
    {
      field: 'estimated_vol_change',
      suppressMenu: true,
      width: 74,
      type: 'rightAligned',
      headerName: 'V (%)',
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
            {stockData.estimated_vol_change.toFixed(0)}
          </div>
        );
      },
    },
    {
      headerName: 'T (%)',
      field: 'target',
      suppressMenu: true,
      type: 'rightAligned',
      width: 74,
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
            {target.toFixed(0)}
          </div>
        );
      },
    },
    {
      headerName: 'R_2 (%)',
      suppressMenu: true,
      field: 'risk_b2',
      type: 'rightAligned',
      width: 85,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        const { risk_b2 } = evaluateStockBase(filter[0], stockData.fullData);
        if (!risk_b2) return;
        return risk_b2 && risk_b2.toFixed(0);
      },
    },
    {
      headerName: 'R_1(%)',
      field: 'risk_b1',
      type: 'rightAligned',
      suppressMenu: true,
      width: 85,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        const { risk_b1 } = evaluateStockBase(filter[0], stockData.fullData);
        if (!risk_b1) return;
        return risk_b1 && risk_b1.toFixed(0);
      },
    },

    {
      field: 'extra_volume',
      suppressMenu: true,
      type: 'rightAligned',
      headerName: 'extra_V',
      width: 100,
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
    {
      field: 'min_total_value',
      suppressMenu: true,
      hide: true,
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
  ];
};

export default StockTableColumns;
