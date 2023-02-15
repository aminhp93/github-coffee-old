import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BoldOutlined,
  SettingOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { Button, DatePicker, notification, Statistic, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DATE_FORMAT,
  DEFAULT_FILTER,
  DEFAULT_SETTING,
  LIST_ALL_SYMBOLS,
} from '../constants';
import StockService from '../service';
import { StockData, SupabaseData } from '../types';
import {
  filterData,
  getStockDataFromSupabase,
  updateDataWithDate,
  getTodayData,
} from '../utils';
import Backtest from './Backtest';
import './index.less';
import RefreshButton from './RefreshButton';
import Settings from './Setting';
import StockTableColumns from './StockTableColumns';
import Testing from './Testing';
import CustomAgGridReact from 'components/CustomAgGridReact';
import { updateSelectedSymbol } from '../stockSlice';
import { useDispatch } from 'react-redux';

const { RangePicker } = DatePicker;

const StockTable = () => {
  // hooks
  const dispatch = useDispatch();
  const gridRef: any = useRef();
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [openDrawerBacktest, setOpenDrawerBacktest] = useState(false);
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTING);
  const [clickedSymbol, setClickedSymbol] = useState<string>('');
  const [dates, setDates] = useState<
    [moment.Moment, moment.Moment] | undefined
  >();
  const [listStockBase, setListStockBase] = useState<any[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);

  const handleChangeDate = (data: any) => {
    setDates(data);
    getData(data);
  };

  const getData = async (dates: [moment.Moment, moment.Moment] | undefined) => {
    try {
      if (!dates || dates.length !== 2) return;

      gridRef.current?.api?.showLoadingOverlay();

      let resFireant = await getTodayData(dates, LIST_ALL_SYMBOLS);

      const res = await StockService.getStockDataFromSupabase({
        startDate: dates[0].format(DATE_FORMAT),
        endDate: dates[1].format(DATE_FORMAT),
      });

      const resStockBase = await StockService.getAllStockBase();

      gridRef.current?.api?.hideOverlay();

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }

      const newAllStocks = getStockDataFromSupabase(source as SupabaseData[]);

      const filterdData = filterData(newAllStocks, DEFAULT_FILTER);

      if (resStockBase.data && resStockBase.data.length) {
        setListStockBase(resStockBase.data);
      }

      setAllStocks(newAllStocks);
      setListStocks(filterdData);
    } catch (e) {
      console.log(e);
      gridRef.current?.api?.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res: any = await StockService.getLastUpdated();

        if (res.data && res.data.length && res.data.length === 1) {
          const lastUpdated = res.data[0].last_updated;
          let newLastUpdated = moment().format(DATE_FORMAT);
          // check current time before 3pm
          if (moment().hour() < 15) {
            newLastUpdated = moment().add(-1, 'days').format(DATE_FORMAT);
          }

          if (lastUpdated !== newLastUpdated) {
            let nextCall = true;
            let offset = 0;

            while (nextCall) {
              const res = await updateDataWithDate(
                moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
                newLastUpdated,
                offset
              );
              offset += 20;
              if (res && res.length && res[0].length < 20) {
                nextCall = false;
              }
            }

            await StockService.updateLastUpdated({
              column: 'last_updated',
              value: newLastUpdated,
            });
          }

          setDates([moment().add(-1, 'months'), moment()]);
          getData([moment().add(-1, 'months'), moment()]);
        }
        notification.success({ message: 'success' });
      } catch (e) {
        notification.error({ message: 'error' });
        console.log(e);
      }
    };
    init();
  }, []);

  const handleClickSymbol = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    setClickedSymbol(data.data.symbol);
    console.log(217, data.data.symbol);
    dispatch(updateSelectedSymbol(data.data.symbol));
  };

  const handleClickBacktest = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    setOpenDrawerBacktest(true);
    setClickedSymbol(data.data.symbol);
  };

  const _filter_1 = allStocks.filter((i: StockData) => i.change_t0 < -0.02);
  const _filter_2 = allStocks.filter(
    (i: StockData) => i.change_t0 >= -0.02 && i.change_t0 <= 0.02
  );
  const _filter_3 = allStocks.filter((i: StockData) => i.change_t0 > 0.02);

  const footer = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: 'space-between', height: '50px' }}
      >
        <div className="flex" style={{ alignItems: 'center' }}>
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
          <Tooltip title="Backtest">
            <Button
              size="small"
              type="primary"
              icon={<BoldOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerBacktest(true)}
            />
          </Tooltip>
        </div>
        <div className="flex" style={{ alignItems: 'center' }}>
          <RefreshButton onClick={() => getData(dates)} />

          <RangePicker
            style={{ marginLeft: 8 }}
            size="small"
            onChange={handleChangeDate}
            value={dates}
            format={DATE_FORMAT}
          />
          <Statistic
            style={{ marginLeft: 8 }}
            value={_filter_3.length}
            valueStyle={{ color: 'green', fontSize: '14px' }}
            prefix={<ArrowUpOutlined />}
          />
          <Statistic
            valueStyle={{ fontSize: '14px' }}
            value={_filter_2.length}
            style={{ margin: '0 10px' }}
          />
          <Statistic
            value={_filter_1.length}
            valueStyle={{ color: 'red', fontSize: '14px' }}
            prefix={<ArrowDownOutlined />}
          />
        </div>
      </div>
    );
  };

  const onGridReady = useCallback((params: any) => {
    const defaultSortModel = [
      { colId: 'change_t0', sort: 'desc', sortIndex: 0 },
    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
  }, []);

  console.log('StockTable', 'listStocks', listStocks);

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <CustomAgGridReact
          rowData={listStocks}
          columnDefs={StockTableColumns({
            handleClickSymbol,
            handleClickBacktest,
            listStockBase,
          })}
          onGridReady={onGridReady}
          ref={gridRef}
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
