import { Drawer, Button, notification, Table, DatePicker, Divider } from 'antd';
import {
  DATE_FORMAT,
  DEFAULT_FILTER,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import StockService from '../service';
import moment from 'moment';
import {
  getDataFromSupabase,
  getDataFromFireant,
  getBackTestDataOffline,
  getDataSource,
  createBackTestData,
  updateDataWithDate,
  mapDataChart2,
} from '../utils';
import { getRealResult } from '../tests';
import BackTestChart from './BackTestChart';

import type { DatePickerProps } from 'antd';

import { useEffect, useState, useRef, useCallback } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const COLUMN_REAL_RESULT = ({ handleClickRow }: any) => [
  {
    headerName: 'Date',
    field: 'date',
    onCellClicked: (data: any) => {
      handleClickRow(data);
    },
    cellRenderer: (data: any) => {
      if (!data.data.date) return;
      return moment(data.data.date).format(DATE_FORMAT);
    },
  },
  {
    headerName: 'change_t0',
    field: 'change_t0',
    filter: 'agNumberColumnFilter',
    cellRenderer: (data: any) => {
      if (!data.data.change_t0) return;
      return data.data.change_t0.toFixed(1) + '%';
    },
  },
  {
    field: 'base_percent',
    headerName: 'base_percent',
    filter: 'agNumberColumnFilter',
    cellRenderer: (data: any) => {
      if (!data.data.latestBase) return;
      return data.data.latestBase.base_percent.toFixed(1) + '%';
    },
  },
  {
    field: 't0_over_base_max',
    suppressMenu: true,
    headerName: 't0_over_base_max',
    filter: 'agNumberColumnFilter',
    cellRenderer: (data: any) => {
      if (!data.data.t0_over_base_max) return;
      return data.data.t0_over_base_max.toFixed(1) + '%';
    },
  },
  {
    field: 'diff_closet_upper_base',
    suppressMenu: true,
    headerName: 'diff_closet_upper_base',
    filter: 'agNumberColumnFilter',
    cellRenderer: (data: any) => {
      if (!data.data.closetUpperBase) return;
      return (
        data.data.closetUpperBase.startBaseDate +
        data.data.closetUpperBase.endBaseDate
      );
    },
  },
];

interface Props {
  onClose: () => void;
}

const Testing = ({ onClose }: Props) => {
  const gridRef: any = useRef();
  const [listUpdateStatus, setListUpdateStatus] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataFromSupabase, setDataFromSupabase] = useState<any>([]);
  const [dataFromFireant, setDataFromFireant] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [listRealResult, setListRealResult] = useState<any>([]);
  const [dataChart, setDataChart] = useState<any>(null);
  const [fullData, setFullData] = useState<any>([]);

  const getLastUpdated = async () => {
    try {
      const res: any = await StockService.getLastUpdated();
      if (res.data && res.data.length && res.data.length === 1) {
        setLastUpdated(res.data[0].last_updated);
      }
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
  };

  const updateData = async () => {
    if (selectedDate) {
      // if have selected date, update only selected date and no udpate selected date
      updateDataWithDate(
        selectedDate.format(DATE_FORMAT),
        selectedDate.format(DATE_FORMAT),
        0
      );
    } else {
      // if no selected date, update from last updated date to today, update selected date
      let nextCall = true;
      let offset = 0;
      while (nextCall) {
        const res = await updateDataWithDate(
          moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
          offset
        );
        console.log(res);
        offset += 20;
        if (res && res.length && res[0].length < 20) {
          nextCall = false;
        }
      }
      try {
        const res = await StockService.updateLastUpdated({
          column: 'last_updated',
          value: moment().format(DATE_FORMAT),
        });
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleTest = async () => {
    const startDate = DEFAULT_START_DATE.format(DATE_FORMAT);
    const endDate = DEFAULT_END_DATE.format(DATE_FORMAT);
    const supabaseData = await getDataFromSupabase({ startDate, endDate });
    const fireantData = await getDataFromFireant({ startDate, endDate });

    const newDataSupabase = getDataSource(supabaseData, DEFAULT_FILTER);
    const newDataFireant = getDataSource(fireantData, DEFAULT_FILTER);

    const supabaseDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataSupabase,
      fullDataSource: supabaseData,
    });
    const fireantDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataFireant,
      fullDataSource: fireantData,
    });
    console.log(supabaseDataBacktest, fireantDataBacktest);
    setDataFromSupabase(supabaseDataBacktest);
    setDataFromFireant(fireantDataBacktest);
  };

  const handleGetResult = async (symbol: string) => {
    try {
      const res = await getRealResult(symbol);
      setListRealResult(res?.result);
      setFullData(res?.fullData);
    } catch (e) {
      console.log(e);
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
    getLastUpdated();
  }, []);

  useEffect(() => {
    if (!gridRef.current || !gridRef.current.api) return;
    applyFilters();
    const listMarkPoints = fullData.filter((i: any) => i.t0_over_base_max > 0);
    setDataChart(mapDataChart2({ fullData, listMarkPoints }));
  }, [listRealResult]);

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
          <div>Testing</div>
          <div>Last updated: {lastUpdated}</div>
        </div>
      }
      height="90%"
      placement="bottom"
      onClose={onClose}
      open={true}
    >
      <div className="height-100 flex" style={{ flexDirection: 'column' }}>
        <div>
          <div>
            <Button size="small" onClick={updateData}>
              Update data
            </Button>
            <DatePicker size="small" onChange={onChangeDate} />
          </div>
          <Divider />
          <Button
            disabled
            size="small"
            onClick={createBackTestData}
            style={{ marginTop: '20px' }}
          >
            Create backtest
          </Button>

          <Divider />
          <Button
            size="small"
            onClick={handleTest}
            style={{ marginTop: '20px' }}
          >
            Test data from fireant vs supabase
          </Button>
          <Divider />
          <Button onClick={() => handleGetResult('VPB')}>Test VPB</Button>
          <Button onClick={() => applyFilters()}>applyFilters</Button>
          <Button onClick={() => clearAllFilters()}>clearAllFilters</Button>
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
              columnDefs={COLUMN_REAL_RESULT({
                handleClickRow,
              })}
              ref={gridRef}
              // onGridReady={onGridReady}
              defaultColDef={{
                minWidth: 150,
                filter: true,
                sortable: true,
                floatingFilter: true,
              }}
            />
          </div>

          {listUpdateStatus && listUpdateStatus.length && (
            <Table
              size="small"
              dataSource={listUpdateStatus}
              columns={columns}
              pagination={false}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
