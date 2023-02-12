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
import { DATE_FORMAT, DEFAULT_FILTER, DEFAULT_SETTING } from '../constants';
import StockService from '../service';
import { StockData, SupabaseData } from '../types';
import {
  filterData,
  getStockDataFromSupabase,
  updateDataWithDate,
} from '../utils';
import Backtest from './Backtest';
import './index.less';
import RefreshButton from './RefreshButton';
import Settings from './Setting';
import StockDetail from './StockDetail';
import StockTableColumns from './StockTableColumns';
import Testing from './Testing';
import CustomAgGridReact from 'components/CustomAgGridReact';

const { RangePicker } = DatePicker;

const StockTable = () => {
  const gridRef: any = useRef();

  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [openDrawerBacktest, setOpenDrawerBacktest] = useState(false);
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTING);
  const [clickedSymbol, setClickedSymbol] = useState<string>('');
  const [dates, setDates] = useState<[moment.Moment, moment.Moment] | null>();
  const [listStockBase, setListStockBase] = useState<any[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const updateData = async () => {
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
        }

        await StockService.updateLastUpdated({
          column: 'last_updated',
          value: newLastUpdated,
        });

        setDates([moment().add(-1, 'years'), moment()]);
      }
      notification.success({ message: 'success' });
    } catch (e) {
      notification.error({ message: 'error' });
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      if (!dates || dates.length !== 2) return;

      gridRef.current?.api?.showLoadingOverlay();

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);
      const tempStartDate = moment(endDate)
        .add(-1, 'months')
        .format(DATE_FORMAT);

      let resFireant;
      if (
        dates[1].format(DATE_FORMAT) === moment().format(DATE_FORMAT) &&
        moment().hour() < 15 &&
        !localStorage.getItem('turnOffFetchTodayData')
      ) {
        const res = await StockService.getStockDataFromFireant({
          startDate: moment().format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
        });
        resFireant = res.map((i) => {
          const item = i.data && i.data[0];
          if (item) {
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
          }
          return null;
        });
        resFireant = resFireant.filter((i) => i);
      }

      const res = await StockService.getStockDataFromSupabase({
        startDate: tempStartDate,
        endDate,
      });

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }

      const newAllStocks = getStockDataFromSupabase(source as SupabaseData[]);

      const filterdData = filterData(newAllStocks, DEFAULT_FILTER);

      const listSymbols = filterdData.map((i) => i.symbol);

      const res2 = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
        listSymbols,
      });

      const resStockBase = await StockService.getAllStockBase();

      gridRef.current?.api?.hideOverlay();

      if (resStockBase.data && resStockBase.data.length) {
        setListStockBase(resStockBase.data);
      }

      let source2: any = res2.data;
      if (resFireant) {
        const filteredResFireant = resFireant.filter((i) =>
          listSymbols.includes(i!.symbol)
        );
        source2 = [...filteredResFireant, ...source2];
      }

      const newListStocks = getStockDataFromSupabase(source2 as SupabaseData[]);

      setAllStocks(newAllStocks);
      setListStocks(newListStocks);
    } catch (e) {
      console.log(e);
      gridRef.current?.api?.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  useEffect(() => {
    updateData();
  }, []);

  const handleClickSymbol = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    setClickedSymbol(data.data.symbol);
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
          <RefreshButton onClick={() => getData()} />

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

  console.log(listStocks, 'listStocks', dates);

  return (
    <div className="StockTable height-100 flex">
      <div className="flex height-100 width-100" style={{ flex: 1 }}>
        <div className="ag-theme-alpine height-100 width-100">
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
        <div className="height-100 width-100">
          <StockDetail dates={dates} symbol={clickedSymbol} />
        </div>
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
