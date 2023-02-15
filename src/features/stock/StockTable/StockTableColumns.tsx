import moment from 'moment';
import { DATE_FORMAT } from '../constants';
import { StockData } from '../types';
import { evaluateStockBase } from '../utils';

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
      headerName: 'Symbol',
      field: 'symbol',
      width: 110,
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
      headerName: 't0',
      field: 'change_t0',
      type: 'rightAligned',
      width: 90,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: any) => {
        const stockData: StockData = data.data;
        if (!stockData.change_t0) return;
        return stockData.change_t0.toFixed(1) + '%';
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
              color: stockData.estimated_vol_change > 0.5 ? 'green' : '',
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

        if (!stockData.change_t0) return;
        const { target } = evaluateStockBase(filter[0], stockData.fullData);
        if (!target) return;
        return target && target.toFixed(0) + '%';
      },
    },
    {
      headerName: 'risk',
      field: 'risk',
      type: 'rightAligned',
      width: 100,
      cellRenderer: (data: any) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        const filter = listStockBase.filter(
          (i: any) => i.symbol === stockData.symbol
        );
        if (!filter.length || filter.length !== 1) return;

        if (!stockData.change_t0) return;
        const { risk } = evaluateStockBase(filter[0], stockData.fullData);
        if (!risk) return;
        return risk && risk.toFixed(0) + '%';
      },
    },

    {
      field: 'extra_volume',
      suppressMenu: true,
      type: 'rightAligned',
      headerName: 'extra_volume',
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
