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
      onCellClicked: (data: any) => {
        handleClickSymbol(data);
      },
    },
    {
      headerName: 'minValue',
      field: 'minValue',
      type: 'rightAligned',

      cellRenderer: (data: any) => {
        return (data.data.minValue / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'marketCap',
      field: 'marketCap',
      type: 'rightAligned',

      cellRenderer: (data: any) => {
        return (data.data.marketCap / UNIT_BILLION).toFixed(0);
      },
    },
    {
      headerName: 'averageChange',
      field: 'averageChange',
      type: 'rightAligned',

      cellRenderer: (data: any) => {
        return data.data.averageChange.toFixed(1) + '%';
      },
    },
    {
      headerName: 'averageRangeChange',
      field: 'averageRangeChange',
      type: 'rightAligned',

      cellRenderer: (data: any) => {
        return data.data.averageRangeChange.toFixed(1) + '%';
      },
    },
    {
      headerName: 'is_blacklist',
      field: 'is_blacklist',
    },
    {
      headerName: '',
      field: 'action',
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
