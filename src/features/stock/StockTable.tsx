import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { StockService } from 'services';

import { useEffect } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { keyBy } from 'lodash';

const columns: GridColDef[] = [
  {
    field: 'symbol',
    width: 100,
    headerName: 'Symbol',
  },
];

export default function StockTable() {
  const [loading, setLoading] = React.useState(false);
  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] = React.useState('');
  const [rows, setRows] = React.useState([] as any);
  const [checkedFundamentals, setCheckedFundamentals] = React.useState(false);

  const handleChangeWatchlist = (event: SelectChangeEvent) => {
    setCurrentWatchlist(event.target.value as string);
  };

  const handleUpdateRows = () => {
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
  };

  const fetchList = async () => {
    setLoading(true);
    const res = await StockService.getWatchlist();
    setListWatchlist(res.data);
  };

  const handleChangeFundamentals = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedFundamentals(event.target.checked);
    const listPromises: any = [];
    rows.forEach((i: any) => {
      listPromises.push(StockService.getFundamental(i.symbol));
    });
    setLoading(true);
    return Promise.all(listPromises)
      .then((res) => {
        setLoading(false);
        const keyByRes = keyBy(res, 'symbol');
        const newData = rows.map((i: any) => {
          i.fundamentals = keyByRes[i.symbol].res;
          return i;
        });
        setRows(newData);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleUpdateRows();
  }, [currentWatchlist]);

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
