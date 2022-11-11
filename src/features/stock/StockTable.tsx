import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { StockService } from 'libs/services';
import * as React from 'react';

import { useEffect } from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { keyBy } from 'lodash';
import { UNIT_BILLION } from './utils';
type TSymbolList = string[];
type TSymbol = string;

const DEAFULT_COLUMNS: GridColDef[] = [
  {
    field: 'symbol',
    width: 100,
    headerName: 'Symbol',
  },
  {
    field: 'marketCap',
    width: 100,
    headerName: 'marketCap (billion)',
    align: 'right',
    renderCell: (data: GridRenderCellParams) => {
      return Number((data.row.marketCap / UNIT_BILLION).toFixed(0));
    },
  },
  {
    field: 'marketCapGreater1000',
    width: 100,
    align: 'center',

    headerName: 'marketCapGreater1000',
    renderCell: (data: GridRenderCellParams) => {
      return data.row.marketCapGreater1000 ? (
        // <CheckIcon color="success" />
        <CheckBoxIcon color="success" />
      ) : (
        <DisabledByDefaultIcon color="error" />
      );
    },
  },
];

export default function StockTable() {
  const [, setLoading] = React.useState(false);
  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] = React.useState('');
  const [rows, setRows] = React.useState([] as any);
  const [checkedFundamentals, setCheckedFundamentals] = React.useState(false);
  const [columns, setColumns] = React.useState(DEAFULT_COLUMNS);
  const [checkedMarketCapGreater1000, setCheckedMarketCapGreater1000] =
    React.useState(false);

  const handleChangeWatchlist = (event: SelectChangeEvent) => {
    setCurrentWatchlist(event.target.value as string);
  };

  const fetchList = async () => {
    setLoading(true);
    const res = await StockService.getWatchlist();
    setListWatchlist(res.data);
  };

  const fetchFundamentals = (data: TSymbolList) => {
    if (!data || !data.length) return;

    const listPromises: any = [];
    data.forEach((i: TSymbol) => {
      listPromises.push(StockService.getFundamental(i));
    });
    setLoading(true);

    return Promise.all(listPromises)
      .then((res) => {
        console.log(res);
        // setLoading(false);
        // const keyByRes = keyBy(res, 'symbol');
        // const newData = rows.map((i: any) => {
        //   i.fundamentals = keyByRes[i.symbol].res;
        //   return i;
        // });
        // setRows(newData);
        return res;
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleChangeFundamentals = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedFundamentals(event.target.checked);
    const keyByWl = keyBy(listWatchlist, 'name');
    if (!keyByWl) return;
    const symbols: any = ((keyByWl[currentWatchlist] || {}) as any).symbols;
    const res: any = await fetchFundamentals(symbols);
    let newRows = [...rows];
    const keyByRes = keyBy(res, 'symbol');
    newRows = newRows.map((i: any) => {
      i.fundamentals = keyByRes[i.symbol].data;
      i.marketCap = i.fundamentals.marketCap;
      i.marketCapGreater1000 = i.marketCap > 1_000_000_000_000;
      return i;
    });
    setRows(newRows);
  };

  const handleChangeCheckedMarketCapGreater1000 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.checked);
    setCheckedMarketCapGreater1000(event.target.checked);
    const filteredColumns = columns.filter(
      (i: any) => i.field === 'marketCapGreater1000'
    );
    if (event.target.checked) {
      if (filteredColumns.length > 0) {
        //
      } else {
        const newColumns = [...columns];
        newColumns.push({
          field: 'marketCapGreater1000',
          width: 100,
          align: 'center',

          headerName: 'marketCapGreater1000',
          renderCell: (data: GridRenderCellParams) => {
            return data.row.marketCapGreater1000 ? (
              // <CheckIcon color="success" />
              <CheckBoxIcon color="success" />
            ) : (
              <DisabledByDefaultIcon color="error" />
            );
          },
        });
        setColumns(newColumns);
      }
    } else {
      if (filteredColumns.length > 0) {
        const newColumns: any = columns.filter(
          (i: any) => i.field !== 'marketCapGreater1000'
        );
        setColumns(newColumns);
      } else {
        //
      }
    }
  };

  useEffect(() => {
    (() => {
      const keyByWl = keyBy(listWatchlist, 'name');
      if (!keyByWl) return;
      const symbols: any = ((keyByWl[currentWatchlist] || {}) as any).symbols;
      if (!symbols) return;
      const newRows = symbols.map((i: any) => {
        return {
          symbol: i,
          id: i,
        };
      });
      setRows(newRows);
    })();
  }, [currentWatchlist, listWatchlist]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ flex: 1, marginTop: '8px' }}>
        <Box sx={{ width: '100px' }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Watchlist</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentWatchlist}
              label="Watchlist"
              onChange={handleChangeWatchlist}
            >
              {listWatchlist.map((i: any) => {
                return (
                  <MenuItem value={i.name} key={i.watchlistID}>
                    {i.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChangeFundamentals}
                  checked={checkedFundamentals}
                />
              }
              label="Fundamentals"
            />
          </FormGroup>
        </Box>
        <Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChangeCheckedMarketCapGreater1000}
                  checked={checkedMarketCapGreater1000}
                />
              }
              label="checkedMarketCapGreater1000"
            />
          </FormGroup>
        </Box>
      </Box>
      <Box sx={{ height: '710px', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={30}
          pageSize={20}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Box>
  );
}
