import { UNIT_BILLION } from '../constants';

interface Props {
  handleClickSymbol: (record: any) => void;
  handleClickUpdate: (record: any) => void;
}

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
      onCellClicked: (data: any) => {
        handleClickSymbol(data);
      },
    },
    {
      headerName: 'minValue',
      field: 'minValue',
      type: 'rightAligned',
      width: 100,
      suppressMenu: true,
      cellRenderer: (data: any) => {
        return (data.data.minValue / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'marketCap',
      field: 'marketCap',
      width: 100,
      type: 'rightAligned',
      suppressMenu: true,
      cellRenderer: (data: any) => {
        return (data.data.marketCap / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'averageChange (%)',
      width: 100,
      field: 'averageChange',
      type: 'rightAligned',
      suppressMenu: true,
      cellRenderer: (data: any) => {
        return data.data.averageChange.toFixed(1);
      },
    },
    {
      headerName: 'averageRangeChange',
      field: 'averageRangeChange',
      type: 'rightAligned',
      width: 100,
      suppressMenu: true,
      cellRenderer: (data: any) => {
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
      onCellClicked: (data: any) => {
        handleClickUpdate(data);
      },
      cellRenderer: (data: any) => {
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
