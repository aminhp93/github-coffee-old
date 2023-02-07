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
  DEFAULT_SETTING,
  DATE_FORMAT,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import {
  filterData,
  updateDataWithDate,
  getStockDataFromSupabase,
} from '../utils';
import Filters from './Filter';
import './index.less';
import Settings from './Setting';
import Backtest from './Backtest';
import Testing from './Testing';
import { Filter, SupabaseData, StockData } from '../types';
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
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState(DEFAULT_SETTING);
  const [clickedSymbol, setClickedSymbol] = useState<string>('');
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>([
    DEFAULT_START_DATE,
    DEFAULT_END_DATE,
  ]);

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
      gridRef.current.api && gridRef.current.api.showLoadingOverlay();
      await updateData();

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);

      // get data

      // use latest data
      // For now only can use data from fireant
      const useLatestData = localStorage.getItem('useLatestData');
      let resFireant;
      if (useLatestData) {
        const res = await StockService.getStockDataFromFireant({
          startDate: moment().format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
        });
        resFireant = res.map((i) => {
          const item = i.data[0];
          const {
            date,
            dealVolume,
            priceClose,
            priceHigh,
            priceLow,
            priceOpen,
            symbol,
            totalValue,
            totalVolume,
          } = item;
          return {
            date: moment(date).format(DATE_FORMAT),
            dealVolume,
            priceClose,
            priceHigh,
            priceLow,
            priceOpen,
            symbol,
            totalValue,
            totalVolume,
          };
        });
      }

      // use old static data from supabase (updated 1 day ago)

      const res = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
      });
      gridRef.current.api && gridRef.current.api.hideOverlay();
      console.log('res', res);

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }
      console.log('source', source);

      const mappedData = getStockDataFromSupabase(source as SupabaseData[]);
      console.log('mappedData', mappedData);

      const filterdData = filterData(mappedData, filters);
      console.log('filterdData', filterdData);

      setListStocks(filterdData);
    } catch (e) {
      console.log(e);
      gridRef.current.api && gridRef.current.api.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  const header = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="flex">
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
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
      {header()}
      <div
        className="ag-theme-alpine"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact
          rowData={listStocks}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
          }
          columnDefs={StockTableColumns({
            handleClickRow,
          })}
          ref={gridRef}
          defaultColDef={{
            filter: true,
            sortable: true,
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
          onChange={(data: Filter) => setFilters({ ...filters, ...data })}
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
