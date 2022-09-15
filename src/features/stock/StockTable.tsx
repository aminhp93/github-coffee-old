import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { StockService } from 'services';

import { useEffect } from 'react';

import FormControl from '@mui/material/FormControl';
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

  useEffect(() => {
    handleUpdateRows();
  }, [currentWatchlist]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Box>
        <Box sx={{ minWidth: 120 }} mt={2}>
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
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
