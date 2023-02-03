import moment from 'moment';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SettingOutlined,
  WarningOutlined,
  BoldOutlined,
} from '@ant-design/icons';
import { Button, notification, Statistic, DatePicker, Tooltip } from 'antd';
import StockService from '../service';
import { useEffect, useState, useRef } from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_SETTINGS,
  DATE_FORMAT,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import { filterData, updateDataWithDate, mapDataFromSupabase } from '../utils';
import Filters from './Filters';
import './index.less';
import Settings from './Settings';
import Backtest from './Backtest';
import Testing from './Testing';
import { BaseFilter, Watchlist, SupabaseData, StockData } from '../types';
import { AgGridReact } from 'ag-grid-react';
import StockTableColumns from './StockTableColumns';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const { RangePicker } = DatePicker;

const StockTable = () => {
  const gridRef: any = useRef();

  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [openDrawerBacktest, setOpenDrawerBacktest] = useState(false);
  const [listWatchlist, setListWatchlist] = useState<Watchlist[]>([]);
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [clickedSymbol, setClickedSymbol] = useState<string>('');
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>([
    DEFAULT_START_DATE,
    DEFAULT_END_DATE,
  ]);

  const handleUpdateWatchlist = async (symbols?: string[]) => {
    try {
      const watchlistObj = {
        watchlistID: 2279542,
        name: 'daily_test_watchlist',
        userName: 'minhpn.org.ec1@gmail.com',
      };

      const updateData = {
        ...watchlistObj,
        symbols: symbols ? symbols : listStocks.map((i: StockData) => i.symbol),
      };

      await StockService.updateWatchlist(watchlistObj, updateData);
      notification.success({ message: 'Update wl success' });
    } catch (e) {
      notification.error({ message: 'Update wl success' });
    }
  };

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const updateData = async () => {
    const res: any = await StockService.getLastUpdated();

    if (res.data && res.data.length && res.data.length === 1) {
      const lastUpdated = res.data[0].last_updated;
      if (lastUpdated === moment().format(DATE_FORMAT)) return;
      let nextCall = true;
      let offset = 0;
      while (nextCall) {
        const res = await updateDataWithDate(
          moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
          offset
        );
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

  const getData = async () => {
    try {
      await updateData();

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);
      setLoading(true);

      // get data
      const res = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
      });
      console.log('res', res);

      const mappedData = mapDataFromSupabase(res.data as SupabaseData[]);
      console.log('mappedData', mappedData);

      const filterdData = filterData(mappedData, filters);
      console.log('filterdData', filterdData);

      setListStocks(filterdData);
      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      setLoading(false);
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  useEffect(() => {
    (async () => {
      const res = await StockService.getWatchlist();
      if (res && res.data) {
        setListWatchlist(res.data);
      }
    })();
  }, []);

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="flex">
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
            disabled={loading}
            onClick={getData}
          />
          <RangePicker
            size="small"
            onChange={handleChangeDate}
            defaultValue={dates}
            format={DATE_FORMAT}
          />
        </div>
        <div className={'flex'}>
          <Statistic
            value={_filter_3.length}
            valueStyle={{ color: 'green' }}
            prefix={<ArrowUpOutlined />}
          />
          <Statistic value={_filter_2.length} style={{ margin: '0 10px' }} />
          <Statistic
            value={_filter_1.length}
            valueStyle={{ color: 'red' }}
            prefix={<ArrowDownOutlined />}
          />
        </div>
      </div>
    );
  };

  const handleClickRow = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    setOpenDrawerBacktest(true);
    setClickedSymbol(data.data.symbol);
  };

  const _filter_1 = listStocks.filter((i: StockData) => i.change_t0 < -0.02);
  const _filter_2 = listStocks.filter(
    (i: StockData) => i.change_t0 >= -0.02 && i.change_t0 <= 0.02
  );
  const _filter_3 = listStocks.filter((i: StockData) => i.change_t0 > 0.02);

  const footer = () => {
    return (
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div>
          {`${String(listStocks.length)} rows`}
          <Tooltip title="Setting">
            <Button
              size="small"
              type="primary"
              style={{ marginLeft: 8 }}
              icon={<SettingOutlined />}
              onClick={() => setOpenDrawerSettings(true)}
            />
          </Tooltip>
          <Tooltip title="Testing">
            <Button
              size="small"
              type="primary"
              icon={<WarningOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerTesting(true)}
            />
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Backtest">
            <Button
              size="small"
              type="primary"
              icon={<BoldOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerBacktest(true)}
            />
          </Tooltip>
          <Tooltip title="Filter">
            <Button
              size="small"
              type="primary"
              icon={<FilterOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerFilter(true)}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  console.log(listStocks, 'listStocks');

  return (
    <div className="StockTable height-100 flex">
      {renderHeader()}
      <div
        className="ag-theme-alpine"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact
          rowData={listStocks}
          columnDefs={StockTableColumns({
            handleClickRow,
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
      {footer()}

      {openDrawerTesting && (
        <Testing onClose={() => setOpenDrawerTesting(false)} />
      )}

      {openDrawerBacktest && (
        <Backtest
          symbol={clickedSymbol}
          onClose={() => setOpenDrawerBacktest(false)}
        />
      )}

      {openDrawerFilter && (
        <Filters
          listWatchlist={listWatchlist}
          onChange={(data: Partial<BaseFilter>) =>
            setFilters({ ...filters, ...data })
          }
          onDateChange={(newDates: [moment.Moment, moment.Moment]) =>
            setDates(newDates)
          }
          onUpdateWatchlist={handleUpdateWatchlist}
          onGetData={() => {
            // console.log('onGetData');
          }}
          onColumnChange={(newColumns: any) => {}}
          onClose={() => setOpenDrawerFilter(false)}
        />
      )}
      {openDrawerSettings && (
        <Settings
          onChange={(data: any) => setSettings({ ...settings, ...data })}
          onClose={() => setOpenDrawerSettings(false)}
        />
      )}
    </div>
  );
};

export default StockTable;
