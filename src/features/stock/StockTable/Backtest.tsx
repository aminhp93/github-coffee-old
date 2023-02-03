import {
  Drawer,
  Button,
  notification,
  DatePicker,
  Divider,
  Select,
} from 'antd';
import { DATE_FORMAT, LIST_ALL_SYMBOLS } from '../constants';
import StockService from '../service';
import moment from 'moment';
import { mapDataChart2, mapDataFromSupabase } from '../utils';
import BackTestChart from './BackTestChart';
import { SupabaseData } from '../types';
import { useEffect, useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import StockTableColumns from './StockTableColumns';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const { RangePicker } = DatePicker;

interface Props {
  onClose: () => void;
  symbol?: string;
}

const Testing = ({ onClose, symbol = 'VPB' }: Props) => {
  const gridRef: any = useRef();
  const [listRealResult, setListRealResult] = useState<any>([]);
  const [dataChart, setDataChart] = useState<any>(null);
  const [fullData, setFullData] = useState<any>([]);
  const [dates, setDates] = useState<any>([
    moment('2022-01-01'),
    moment('2022-12-31'),
  ]);

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const getData = async (symbol: string) => {
    try {
      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);

      // get data
      const res = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
        listSymbols: [symbol],
      });
      console.log('res', res);

      const mappedData = mapDataFromSupabase(res.data as SupabaseData[]);
      console.log('mappedData', mappedData);
      const data = mappedData[0].backtestData;
      setListRealResult(data.result);
      setFullData(data.fullData);

      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const handleClickRow = (data: any) => {
    console.log(data);
    const latestBase = data.data.latestBase;
    const closetUpperBase = data.data.closetUpperBase;
    const listMarkPoints = fullData.filter((i: any) => i.t0_over_base_max > 0);
    const listMarkLines = [
      [
        {
          coord: [latestBase.startBaseDate, latestBase.base_min],
        },
        {
          coord: [latestBase.endBaseDate, latestBase.base_min],
        },
      ],
      [
        {
          coord: [latestBase.startBaseDate, latestBase.base_max],
        },
        {
          coord: [latestBase.endBaseDate, latestBase.base_max],
        },
      ],
      [
        {
          coord: [closetUpperBase.startBaseDate, closetUpperBase.base_min],
        },
        {
          coord: [closetUpperBase.endBaseDate, closetUpperBase.base_min],
        },
      ],
      [
        {
          coord: [closetUpperBase.startBaseDate, closetUpperBase.base_max],
        },
        {
          coord: [closetUpperBase.endBaseDate, closetUpperBase.base_max],
        },
      ],
    ];
    setDataChart(mapDataChart2({ fullData, listMarkPoints, listMarkLines }));
  };

  const applyFilters = useCallback(() => {
    const ageFilterComponent =
      gridRef.current.api.getFilterInstance('t0_over_base_max');
    ageFilterComponent.setModel({
      type: 'greaterThan',
      filter: 0,
      filterTo: null,
    });
    gridRef.current.api.onFilterChanged();
  }, []);

  const clearAllFilters = useCallback(() => {
    gridRef.current.api.setFilterModel(null);
  }, []);

  useEffect(() => {
    if (!gridRef.current || !gridRef.current.api) return;
    applyFilters();
    const listMarkPoints = fullData.filter((i: any) => i.t0_over_base_max > 0);
    setDataChart(mapDataChart2({ fullData, listMarkPoints }));
  }, [listRealResult]);

  useEffect(() => {
    getData(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  console.log(
    listRealResult,
    'listRealResult',
    dataChart,
    'dataChart',
    gridRef.current
  );

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Backtest</div>
          <RangePicker
            size="small"
            onChange={handleChangeDate}
            defaultValue={dates}
            format={DATE_FORMAT}
          />
        </div>
      }
      height="90%"
      placement="bottom"
      onClose={onClose}
      open={true}
    >
      <div className="height-100 flex" style={{ flexDirection: 'column' }}>
        <div>
          <Select
            showSearch
            size="small"
            defaultValue={symbol}
            style={{ width: 120 }}
            onChange={(value: string) => {
              getData(value);
            }}
            options={LIST_ALL_SYMBOLS.map((i) => {
              return { value: i, label: i };
            })}
          />
          <Button size="small" onClick={() => applyFilters()}>
            applyFilters
          </Button>
          <Button size="small" onClick={() => clearAllFilters()}>
            clearAllFilters
          </Button>
          <Divider />
        </div>
        <div style={{ height: '600px', width: '100%' }}>
          {dataChart && <BackTestChart data={dataChart} />}
        </div>
        <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
          <div
            className="ag-theme-alpine"
            style={{ height: '100%', width: '100%' }}
          >
            <AgGridReact
              rowData={listRealResult}
              columnDefs={StockTableColumns({
                handleClickRow,
                isBacktest: true,
              })}
              ref={gridRef}
              defaultColDef={{
                minWidth: 150,
                filter: true,
                sortable: true,
                floatingFilter: true,
              }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
