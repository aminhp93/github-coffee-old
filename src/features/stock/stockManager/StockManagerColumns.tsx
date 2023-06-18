import { TData } from 'components/customAgGridReact/CustomAgGridReact';
import { UNIT_BILLION } from '../constants';
import { CellClickedEvent, ValueGetterParams } from 'ag-grid-community';

type Props = {
  handleClickSymbol: (data: any) => void;
  handleClickUpdate: (data: any) => void;
};

const StockManagerColumns = ({
  handleClickSymbol,
  handleClickUpdate,
}: Props) => {
  return [
    {
      headerName: '',
      field: 'symbol',
      suppressMenu: true,
      width: 80,
      onCellClicked: (data: CellClickedEvent<TData>) => {
        const stockData: any = data.data;

        handleClickSymbol && handleClickSymbol(stockData);
      },
    },
    {
      headerName: 'minValue',
      field: 'minValue',
      type: 'rightAligned',
      width: 100,
      suppressMenu: true,
      cellRenderer: (data: ValueGetterParams) => {
        return (data.data.minValue / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'marketCap',
      field: 'marketCap',
      width: 100,
      type: 'rightAligned',
      suppressMenu: true,
      cellRenderer: (data: ValueGetterParams) => {
        return (data.data.marketCap / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'averageChange (%)',
      width: 100,
      field: 'averageChange',
      type: 'rightAligned',
      suppressMenu: true,
      cellRenderer: (data: ValueGetterParams) => {
        return data.data.averageChange.toFixed(1);
      },
    },
    {
      headerName: 'averageRangeChange',
      field: 'averageRangeChange',
      type: 'rightAligned',
      width: 100,
      suppressMenu: true,
      cellRenderer: (data: ValueGetterParams) => {
        return data.data.averageRangeChange.toFixed(1);
      },
    },
    {
      headerName: 'is_blacklist',
      width: 100,
      field: 'is_blacklist',
      suppressMenu: true,
    },
    {
      headerName: '',
      field: 'action',
      width: 100,
      suppressMenu: true,
      onCellClicked: (data: CellClickedEvent<TData>) => {
        const stockData: any = data.data;
        handleClickUpdate(stockData);
      },
      cellRenderer: (data: ValueGetterParams) => {
        let text = 'Add ';
        if (data.data.is_blacklist) {
          text = 'Remove';
        }
        return text;
      },
    },
  ];
};

export default StockManagerColumns;
