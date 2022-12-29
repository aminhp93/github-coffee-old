import moment from 'moment';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SettingOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Dropdown,
  InputNumber,
  Menu,
  notification,
  Popover,
  Statistic,
  Table,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { ColumnsType } from 'antd/es/table';
import { useInterval } from 'libs/hooks';
import StockService from '../service';
import { Watchlist } from 'libs/types';
import { keyBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_SETTINGS,
  DEFAULT_TYPE_INDICATOR_OPTIONS,
  DELAY_TIME,
  TYPE_INDICATOR_OPTIONS,
  NO_DATA_COLUMN,
  HISTORICAL_QUOTE_COLUMN,
  FUNDAMENTAL_COLUMN,
  FINANCIAL_INDICATORS_COLUMN,
  DATE_FORMAT,
  BACKTEST_COUNT,
} from '../constants';
import {
  getFilterData,
  getFinancialIndicator,
  mapBuySell,
  mapHistoricalQuote,
  mapFundamentals,
  getMapBackTestData,
} from '../utils';
import BuySellSignalsColumns from './BuySellSignalsColumns';
import Filters from './Filters';
import InDayReviewColumns from './InDayReviewColumns';
import './index.less';
import Settings from './Settings';
import Testing from './Testing';
import config from 'libs/config';
import request from 'libs/request';

const baseUrl = config.apiUrl;
const CheckboxGroup = Checkbox.Group;

export default function StockTable() {
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [listWatchlist, setListWatchlist] = useState([]);
  const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist | null>(
    null
  );
  const [dataSource, setDataSource] = useState([]);
  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(
    DEFAULT_TYPE_INDICATOR_OPTIONS
  );
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(DELAY_TIME);

  useInterval(
    async () => {
      const res = await handleGetData();
      const filteredRes = getFilterData(res, filters);
      const symbols = filteredRes.map((item: any) => item.symbol);
      handleUpdateWatchlist(symbols);
    },
    isPlaying ? delay : null
  );

  const handleClickMenuWatchlist = (e: any) => {
    setCurrentWatchlist(listWatchlistObj[e.key]);
    const mapData: any = (listWatchlistObj[e.key] as Watchlist).symbols.map(
      (symbol: string) => {
        return {
          key: symbol,
          symbol,
        };
      }
    );
    setDataSource(mapData);
  };

  const handleUpdateWatchlist = async (symbols?: string[]) => {
    try {
      const watchlistObj = {
        watchlistID: 2279542,
        name: 'daily_test_watchlist',
        userName: 'minhpn.org.ec1@gmail.com',
      };

      const updateData = {
        ...watchlistObj,
        symbols: symbols ? symbols : filteredData.map((i: any) => i.symbol),
      };

      await StockService.updateWatchlist(watchlistObj, updateData);
      notification.success({ message: 'Update wl success' });
    } catch (e) {
      notification.error({ message: 'Update wl success' });
    }
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(
      !!list.length && list.length < TYPE_INDICATOR_OPTIONS.length
    );
    setCheckAll(list.length === TYPE_INDICATOR_OPTIONS.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? TYPE_INDICATOR_OPTIONS : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleGetData = () => {
    const listPromises: any = [];
    const thanh_khoan_vua_wl: any =
      listWatchlistObj && listWatchlistObj[737544];

    const watching_wl: any = listWatchlistObj && listWatchlistObj[75482];

    if (!thanh_khoan_vua_wl) return;

    thanh_khoan_vua_wl.symbols.forEach((j: any) => {
      const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
      // const endDate = moment().add(0, 'days').format(DATE_FORMAT);
      const endDate = '2022-12-25';
      listPromises.push(
        StockService.getHistoricalQuotes(
          { symbol: j, startDate, endDate },
          mapHistoricalQuote,
          {
            key: j,
            symbol: j,
          }
        )
      );
      listPromises.push(
        StockService.getFundamentals({ symbol: j }, mapFundamentals, {
          key: j,
          symbol: j,
        })
      );
      listPromises.push(getFinancialIndicator(j));
    });

    setLoading(true);
    return Promise.all(listPromises)
      .then((res: any) => {
        setLoading(false);
        const newDataSource: any = thanh_khoan_vua_wl?.symbols.map((i: any) => {
          const filterRes = res.filter((j: any) => j.symbol === i);
          let newItem = { key: i, symbol: i };
          if (filterRes.length > 0) {
            filterRes.forEach((j: any) => {
              newItem = {
                ...newItem,
                ...j,
                inWatchingWatchList: watching_wl?.symbols.includes(i),
              };
            });
          }
          return newItem;
        });

        setDataSource(newDataSource);
        notification.success({ message: 'success' });
        return newDataSource;
      })
      .catch((e) => {
        setLoading(false);
        notification.error({ message: 'error' });
      });
  };

  const getBackTestData = () => {
    // Get data to backtest within 1 year from buy, sell symbol
    const listPromises: any = [];
    const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
    // const endDate = moment().add(0, 'days').format(DATE_FORMAT);
    const endDate = '2022-12-25';
    filteredData
      .filter((i: any) => i.action === 'buy' || i.action === 'sell')
      .forEach((j: any) => {
        for (let i = 1; i <= BACKTEST_COUNT; i++) {
          listPromises.push(
            StockService.getHistoricalQuotes({
              symbol: j.symbol,
              startDate,
              endDate,
              offset: i * 20,
            })
          );
        }
      });
    setLoading(true);

    Promise.all(listPromises)
      .then((res: any) => {
        setLoading(false);
        const flattenData = res.flat();
        console.log(flattenData);
        const newDataSource: any = getMapBackTestData(flattenData, dataSource);
        setDataSource(newDataSource);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const getBackTestDataOffline = async () => {
    try {
      setLoading(true);
      const res = await request({
        url: `${baseUrl}/api/stocks/`,
        method: 'GET',
      });
      setLoading(false);
      const mappedData = res.data.map((i: any) => {
        const item: any = {};
        item.date = i.d;
        item.dealVolume = i.v;
        item.priceClose = i.c;
        item.priceHigh = i.h;
        item.priceLow = i.l;
        item.priceOpen = i.o;
        item.totalVolume = i.v2;
        item.symbol = i.s;
        return item;
      });
      console.log(mappedData);

      const newDataSource: any = getMapBackTestData(mappedData, dataSource);
      setDataSource(newDataSource);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const filteredData = useMemo(
    () => mapBuySell(getFilterData(dataSource, filters)),
    [dataSource, filters]
  );

  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWatchlist]);

  useEffect(() => {
    const columns: any = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
        sorter: (a: any, b: any) => a['symbol'].localeCompare(b['symbol']),
      },
    ];
    if (checkedList.includes('HistoricalQuote')) {
      columns.push({
        title: 'Historical Quotes',
        children: HISTORICAL_QUOTE_COLUMN,
      });
    }

    if (checkedList.includes('Fundamental')) {
      columns.push({
        title: 'Fundamentals',
        children: FUNDAMENTAL_COLUMN,
      });
    }

    if (checkedList.includes('FinancialIndicators')) {
      columns.push({
        title: 'FinancialIndicators',
        children: FINANCIAL_INDICATORS_COLUMN,
      });
    }

    if (checkedList.includes('BuySellSignals')) {
      columns.push({
        title: 'BuySellSignals',
        children: BuySellSignalsColumns(),
      });
    }

    if (checkedList.includes('NoData')) {
      columns.push({
        title: 'NoData',
        children: NO_DATA_COLUMN,
      });
    }

    if (checkedList.includes('InDayReview')) {
      columns.push({
        title: 'InDayReview',
        children: InDayReviewColumns,
      });
    }

    setColumns(columns);
  }, [checkedList, dataSource]);

  useEffect(() => {
    (async () => {
      const res = await StockService.getWatchlist();
      if (res && res.data) {
        setListWatchlist(res.data);
      }
    })();
  }, []);

  const menu = (
    <Menu onClick={(e: any) => handleClickMenuWatchlist(e)}>
      {listWatchlist.map((i: any) => {
        return (
          <Menu.Item disabled={i.name === 'all'} key={i.watchlistID}>
            {i.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="flex">
          <Dropdown overlay={menu} trigger={['hover']}>
            <Button size="small" style={{ marginRight: '8px' }}>
              {currentWatchlist?.name || 'Select watchlist'}
            </Button>
          </Dropdown>
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
            disabled={loading}
            onClick={handleGetData}
          />
          <div style={{ marginLeft: '8px' }}>
            <Button size="small" onClick={() => setPlaying(!isPlaying)}>
              {isPlaying ? 'Stop Interval' : 'Start Interval'}
            </Button>
            <InputNumber
              size="small"
              style={{ marginLeft: '8px' }}
              disabled={isPlaying}
              value={delay}
              onChange={(value: any) => setDelay(value)}
            />
          </div>

          <Button size="small" onClick={getBackTestData}>
            Backtest online
          </Button>
          <Button size="small" onClick={getBackTestDataOffline}>
            Backtest offline
          </Button>
        </div>
        <div className={'flex'}>
          <Statistic
            // title="Buy > 2%"
            value={_filter_3.length}
            valueStyle={{ color: 'green' }}
            prefix={<ArrowUpOutlined />}
          />
          <Statistic
            // title="Normal"
            value={_filter_2.length}
            style={{ margin: '0 10px' }}
          />
          <Statistic
            // title="Sell < -2%"
            value={_filter_1.length}
            valueStyle={{ color: 'red' }}
            prefix={<ArrowDownOutlined />}
          />
        </div>
        <Popover
          placement="leftTop"
          content={
            <div>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                All
              </Checkbox>
              <CheckboxGroup
                options={TYPE_INDICATOR_OPTIONS}
                value={checkedList}
                onChange={onChange}
              />
            </div>
          }
        >
          <Button size="small" type="primary">
            Hover me
          </Button>
        </Popover>
      </div>
    );
  };

  const _filter_1 = dataSource.filter((i: any) => i.changePrice < -0.02);
  const _filter_2 = dataSource.filter(
    (i: any) => i.changePrice >= -0.02 && i.changePrice <= 0.02
  );
  const _filter_3 = dataSource.filter((i: any) => i.changePrice > 0.02);

  const footer = () => {
    return (
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div>{String(filteredData.length)}</div>
        <div>
          <Button
            size="small"
            type="primary"
            icon={<WarningOutlined />}
            onClick={() => setOpenDrawerTesting(true)}
          />
          <Button
            size="small"
            type="primary"
            style={{ marginLeft: 8 }}
            icon={<SettingOutlined />}
            onClick={() => setOpenDrawerSettings(true)}
          />
          <Button
            size="small"
            type="primary"
            icon={<FilterOutlined />}
            style={{ marginLeft: 8 }}
            onClick={() => setOpenDrawerFilter(true)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="StockTable">
      <div>
        {renderHeader()}
        <Table
          {...settings}
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          footer={footer}
        />
      </div>
      <Testing
        listWatchlistObj={listWatchlistObj}
        open={openDrawerTesting}
        onClose={() => setOpenDrawerTesting(false)}
      />
      <Filters
        open={openDrawerFilter}
        onChange={(data: any) => setFilters({ ...filters, ...data })}
        onUpdateWatchlist={handleUpdateWatchlist}
        onClose={() => setOpenDrawerFilter(false)}
      />
      <Settings
        open={openDrawerSettings}
        onChange={(data: any) => setSettings({ ...settings, ...data })}
        onClose={() => setOpenDrawerSettings(false)}
      />
    </div>
  );
}
