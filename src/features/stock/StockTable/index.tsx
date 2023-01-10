import moment from 'moment';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SettingOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, notification, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import StockService from '../service';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_SETTINGS,
  DEFAULT_COLUMNS,
  DATE_FORMAT,
  DEFAULT_DATE,
} from '../constants';
import {
  mapHistoricalQuote,
  getMapBackTestData,
  getListAllSymbols,
  getDataSource,
} from '../utils';
import Filters from './Filters';
import './index.less';
import Settings from './Settings';
import Testing from './Testing';
import config from '@/config';
import request from '@/services/request';
import {
  CustomSymbol,
  Watchlist,
  BackTestSymbol,
  SimplifiedBackTestSymbol,
} from '../types';

const baseUrl = config.apiUrl;

export default function StockTable() {
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [listWatchlist, setListWatchlist] = useState<Watchlist[]>([]);
  const [fullDataSource, setFullDataSource] = useState<CustomSymbol[]>([]);
  const [dataSource, setDataSource] = useState<CustomSymbol[]>([]);
  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnsType<any>>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [date, setDate] = useState<moment.Moment>(DEFAULT_DATE);

  const handleUpdateWatchlist = async (symbols?: string[]) => {
    try {
      const watchlistObj = {
        watchlistID: 2279542,
        name: 'daily_test_watchlist',
        userName: 'minhpn.org.ec1@gmail.com',
      };

      const updateData = {
        ...watchlistObj,
        symbols: symbols
          ? symbols
          : dataSource.map((i: CustomSymbol) => i.symbol),
      };

      await StockService.updateWatchlist(watchlistObj, updateData);
      notification.success({ message: 'Update wl success' });
    } catch (e) {
      notification.error({ message: 'Update wl success' });
    }
  };

  const handleGetData = () => {
    const listAllSymbols = getListAllSymbols(listWatchlist);
    const listPromises: any = [];
    const thanh_khoan_vua_wl: Watchlist =
      listWatchlistObj && listWatchlistObj[737544];

    const watching_wl: Watchlist = listWatchlistObj && listWatchlistObj[75482];

    if (!thanh_khoan_vua_wl) return;

    listAllSymbols.forEach((j: string) => {
      const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
      const endDate = date.format(DATE_FORMAT);
      listPromises.push(
        StockService.getHistoricalQuotes(
          { symbol: j, startDate, endDate },
          mapHistoricalQuote,
          {
            key: j,
            symbol: j,
            inWatchingWatchList: watching_wl?.symbols.includes(j),
          }
        )
      );
    });

    setLoading(true);
    return Promise.all(listPromises)
      .then((res: CustomSymbol[]) => {
        const newData = getDataSource(res, filters);

        setLoading(false);
        setFullDataSource(res);
        setDataSource(newData);
        notification.success({ message: 'success' });
        return res;
      })
      .catch((e) => {
        setLoading(false);
        notification.error({ message: 'error' });
      });
  };

  const getBackTestDataOffline = async () => {
    try {
      const symbols = dataSource
        .filter(
          (i: CustomSymbol) =>
            i.buySellSignals.action === 'buy' ||
            i.buySellSignals.action === 'sell'
        )
        .map((i: CustomSymbol) => i.symbol);

      setLoading(true);
      const res = await request({
        url: `${baseUrl}/api/stocks/`,
        method: 'GET',
        params: {
          symbols: symbols.join(','),
        },
      });
      setLoading(false);
      const mappedData: BackTestSymbol[] = res.data.map(
        (i: SimplifiedBackTestSymbol) => {
          return {
            date: i.d,
            dealVolume: i.v,
            priceClose: i.c,
            priceHigh: i.h,
            priceLow: i.l,
            priceOpen: i.o,
            totalVolume: i.v2,
            symbol: i.s,
          };
        }
      );

      const newFullDataSource = getMapBackTestData(mappedData, fullDataSource);
      const newData = getDataSource(newFullDataSource, filters);

      setFullDataSource(newFullDataSource);
      setDataSource(newData);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, listWatchlist]);

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
            onClick={handleGetData}
          />

          <Button
            size="small"
            onClick={getBackTestDataOffline}
            style={{ marginLeft: '8px' }}
          >
            Backtest offline
          </Button>
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

  const _filter_1 = dataSource.filter(
    (i: CustomSymbol) => i.buySellSignals.changePrice < -0.02
  );
  const _filter_2 = dataSource.filter(
    (i: CustomSymbol) =>
      i.buySellSignals.changePrice >= -0.02 &&
      i.buySellSignals.changePrice <= 0.02
  );
  const _filter_3 = dataSource.filter(
    (i: CustomSymbol) => i.buySellSignals.changePrice > 0.02
  );

  const footer = () => {
    return (
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div>{String(dataSource.length)}</div>
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

  console.log(dataSource, 'dataSource');

  return (
    <div className="StockTable height-100 flex">
      {renderHeader()}
      <Table
        style={{
          flex: 1,
        }}
        {...settings}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        footer={footer}
      />
      <Testing
        fullDataSource={fullDataSource}
        dataSource={dataSource}
        cbSetLoading={setLoading}
        cbSetDataSource={setDataSource}
        listWatchlistObj={listWatchlistObj}
        open={openDrawerTesting}
        onClose={() => setOpenDrawerTesting(false)}
      />
      <Filters
        open={openDrawerFilter}
        listWatchlist={listWatchlist}
        onChange={(data: any) => setFilters({ ...filters, ...data })}
        onDateChange={(newDate: moment.Moment) => setDate(newDate)}
        onUpdateWatchlist={handleUpdateWatchlist}
        onGetData={() => {
          // console.log('onGetData');
        }}
        onColumnChange={(newColumns: any) => setColumns(newColumns)}
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
