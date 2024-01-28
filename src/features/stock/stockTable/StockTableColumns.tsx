import dayjs from 'dayjs';
import { DATE_FORMAT } from '../constants';
import { StockBase, StockData } from '../Stock.types';
import { getColorStock, getMinTotalValue } from '../utils';
import { CellClickedEvent, ValueGetterParams } from 'ag-grid-community';
import { TData } from 'components/customAgGridReact/CustomAgGridReact';

type Props = {
  handleClickSymbol?: (data: StockData) => void;
  listStockBase?: StockBase[];
};

const StockTableColumns = ({ handleClickSymbol, listStockBase }: Props) => {
  return [
    {
      headerName: '',
      field: 'symbol',
      suppressMenu: true,
      width: 80,
      onCellClicked: (data: CellClickedEvent<TData>) => {
        const stockData: StockData = data.data;
        if (!handleClickSymbol) return;
        handleClickSymbol(stockData);
      },
      cellRenderer: (data: ValueGetterParams) => {
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
      cellRenderer: (data: ValueGetterParams) => {
        const stockData: StockData = data.data;
        if (!stockData.date) return;
        return dayjs(stockData.date).format(DATE_FORMAT);
      },
    },
    {
      headerName: 'P',
      field: 'change_t0',
      type: 'rightAligned',
      suppressMenu: true,
      width: 74,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: ValueGetterParams) => {
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
      headerName: 'V',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: ValueGetterParams) => {
        const stockData: StockData = data.data;
        if (!stockData.estimated_vol_change) return;

        return stockData.estimated_vol_change.toFixed(0);
      },
    },
    {
      headerName: 'T',
      field: 'target',
      suppressMenu: true,
      type: 'rightAligned',
      width: 74,
      cellRenderer: (data: ValueGetterParams) => {
        if (!listStockBase) return;

        const stockData: StockData = data.data;
        if (!stockData) return;
        const { target } = stockData;
        if (!target) return;
        let color = '';

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
      headerName: 'R',
      field: 'risk',
      type: 'rightAligned',
      suppressMenu: true,
      width: 85,
      cellRenderer: (data: ValueGetterParams) => {
        if (!listStockBase) return;
        const stockData: StockData = data.data;
        if (!stockData?.risk) return;
        return stockData.risk.toFixed(0);
      },
    },

    {
      field: 'extra_volume',
      hide: true,
      suppressMenu: true,
      type: 'rightAligned',
      headerName: 'extra_V',
      width: 100,
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: ValueGetterParams) => {
        const stockData: StockData = data.data;
        const extra = stockData.totalVolume - stockData.dealVolume;
        if (!extra) return;
        const percent_extra = (100 * extra) / stockData.dealVolume;

        return `${percent_extra.toFixed(0)}`;
      },
    },
    {
      field: 'min_total_value',
      suppressMenu: true,
      hide: true,
      type: 'rightAligned',
      headerName: 'min_total_value',
      filter: 'agNumberColumnFilter',
      cellRenderer: (data: ValueGetterParams) => {
        const stockData: StockData = data.data;

        const { minTotal, maxTotal, averageTotal } =
          getMinTotalValue(stockData);
        return `${minTotal} - ${maxTotal} - ${averageTotal}`;
      },
    },
  ];
};

export default StockTableColumns;
