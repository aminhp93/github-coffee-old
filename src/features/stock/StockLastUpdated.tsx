/* eslint-disable @typescript-eslint/no-explicit-any */
// Import library
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, notification, Select } from 'antd';
import CustomAgGridReact from 'components/customAgGridReact/CustomAgGridReact';
import { chunk } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';

// Import components
import StockService from './service';
import { updateDataWithDate } from './utils';
import { DATE_FORMAT, START_DATE } from './constants';
import useStockStore from './Stock.store';

const DEFAULT_ROW_DATA: any = [];

const COLUMN_DEFS = ({ handleForceUpdate, stockInfo }: any) => [
  {
    headerName: 'symbol',
    field: 'symbol',
  },
  {
    headerName: 'date',
    field: 'date',
    cellRenderer: (data: any) => {
      const date = START_DATE[data.data.symbol];
      let valid = true;
      if (!date) {
        if (data.data.date !== stockInfo.start_date) {
          valid = false;
        }
      }
      return (
        <div>
          {data.data.date}
          {valid ? (
            <CheckOutlined style={{ color: 'green' }} />
          ) : (
            <CloseOutlined style={{ color: 'red' }} />
          )}
        </div>
      );
    },
  },
  {
    headerName: 'count',
    field: 'count',
  },
  {
    headerName: 'action',
    field: 'action',
    cellRenderer: (data: any) => {
      return (
        <Button onClick={() => handleForceUpdate([data.data.symbol])}>
          Update
        </Button>
      );
    },
  },
];

type Props = {
  onClose: () => void;
};

const StockLastUpdated = ({ onClose }: Props) => {
  const gridRef: React.RefObject<AgGridReact> = useRef(null);

  const [symbol, setSymbol] = useState<string>('VPB');
  const [listAllSymbols, setListAllSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const stockInfo = useStockStore((state) => state.stockInfo);

  const handleTest = async (symbol: string) => {
    try {
      console.log(`start getting last updated of symbol: ${symbol}`);
      const res: any = await StockService.getLastUpdatedStock(symbol);
      const res2 = await StockService.getCountStock(symbol);
      if (res.status === 200 && res2.status === 200) {
        return {
          symbol,
          date: res.data[0].date,
          count: res2.count,
        };
      }
      return {
        symbol,
      };
    } catch (e) {
      console.log(e);
    }
  };

  const handleTestAll = async (listSymbol: string[]) => {
    try {
      gridRef.current?.api.setRowData([]);
      let result: any = [];
      const chunkedListSymbols = chunk(listSymbol, 25);
      for (let i = 0; i < chunkedListSymbols.length; i++) {
        const listPromises = [];
        for (let j = 0; j < chunkedListSymbols[i].length; j++) {
          listPromises.push(handleTest(chunkedListSymbols[i][j]));
        }
        setLoading(true);
        // wait 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await Promise.all(listPromises);
        result = [...result, ...res];
        setLoading(false);
        console.log(res);
      }

      gridRef.current?.api.setRowData(result);
    } catch (e) {
      setLoading(false);
      notification.error({ message: 'error' });
      console.log(e);
    }
  };
  const handleForceUpdate = async (listSymbols: string[]) => {
    try {
      // if no selected date, update from last updated date to today, update selected date
      const start_date = stockInfo?.start_date;
      if (!start_date) {
        notification.error({ message: 'No start date' });
        return;
      }
      let nextCall = true;
      let offset = 0;
      while (nextCall) {
        const res = await updateDataWithDate(
          dayjs(start_date).format(DATE_FORMAT),
          dayjs().format(DATE_FORMAT),
          offset,
          listSymbols
        );
        offset += 20;
        if (res?.length && res[0].length < 20) {
          nextCall = false;
        }
      }

      await StockService.updateLastUpdated({
        column: 'last_updated',
        value: dayjs().format(DATE_FORMAT),
      });

      notification.success({ message: 'success' });
    } catch (e) {
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    const init = async () => {
      const res = await StockService.getAllStockBase();
      if (!res.data) return;
      setListAllSymbols(res.data.map((i) => i.symbol));
    };
    init();
  }, []);

  return (
    <Drawer
      title={'Last updated check'}
      placement="bottom"
      height="60%"
      onClose={onClose}
      open={true}
    >
      <div className="flex height-100" style={{ flexDirection: 'column' }}>
        <div
          className="flex"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '50px',
          }}
        >
          <div>
            <Select
              showSearch
              size="small"
              defaultValue={symbol}
              style={{ width: 120 }}
              onChange={(value: string) => {
                setSymbol(value);
              }}
              options={listAllSymbols.map((i) => {
                return { value: i, label: i };
              })}
            />
            <Button size="small" onClick={() => handleTestAll([symbol])}>
              Test
            </Button>
          </div>
          <div>
            <Button
              disabled={loading}
              size="small"
              onClick={() => handleTestAll(listAllSymbols)}
            >
              Test All Symbols
            </Button>
          </div>
        </div>
        <div className="flex-1 ag-theme-alpine">
          <CustomAgGridReact
            ref={gridRef}
            rowData={DEFAULT_ROW_DATA}
            getRowId={(params: any) => params.data.symbol}
            columnDefs={COLUMN_DEFS({ handleForceUpdate, stockInfo })}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default StockLastUpdated;
