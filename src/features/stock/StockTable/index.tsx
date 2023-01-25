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
import { useEffect, useState } from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_SETTINGS,
  DEFAULT_COLUMNS,
  DATE_FORMAT,
  DEFAULT_DATE,
} from '../constants';
import {
  getMapBackTestData,
  getDataSource,
  getDataFromSupabase,
  getDataFromFireant,
} from '../utils';
import Filters from './Filters';
import './index.less';
import Settings from './Settings';
import Testing from './Testing';
import { CustomSymbol, Watchlist, SimplifiedBackTestSymbol } from '../types';

const StockTable = () => {
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [listWatchlist, setListWatchlist] = useState<Watchlist[]>([]);
  const [fullDataSource, setFullDataSource] = useState<CustomSymbol[]>([]);
  const [dataSource, setDataSource] = useState<CustomSymbol[]>([]);
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

  const getData = async (source: 'supabase' | 'fireant') => {
    try {
      let res: any;
      const startDate = moment().add(-30, 'days').format(DATE_FORMAT);
      const endDate = date.format(DATE_FORMAT);
      setLoading(true);
      if (source === 'supabase') {
        res = await getDataFromSupabase(startDate);
      } else if (source === 'fireant') {
        res = await getDataFromFireant({ startDate, endDate });
      }
      const newData = getDataSource(res, filters);

      const resBackTest = await getBackTestDataOffline({
        database: 'supabase',
        dataSource: newData,
        fullDataSource: res,
      });

      setLoading(false);
      setFullDataSource(resBackTest.fullDataSource);
      setDataSource(resBackTest.newData);
      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      setLoading(false);
      notification.error({ message: 'error' });
    }
  };

  const getBackTestDataOffline = async ({
    database,
    dataSource,
    fullDataSource,
  }: {
    database: 'supabase' | 'heroku';
    dataSource: CustomSymbol[];
    fullDataSource: CustomSymbol[];
  }) => {
    const symbols = dataSource
      .filter(
        (i: CustomSymbol) =>
          i.buySellSignals.action === 'buy' ||
          i.buySellSignals.action === 'sell'
      )
      .map((i: CustomSymbol) => i.symbol);

    const res = await StockService.getBackTestData({ symbols, database });

    let mappedData: any;

    if (database === 'heroku') {
      mappedData = res.data.map((i: SimplifiedBackTestSymbol) => {
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
      });
    } else {
      mappedData = res.data;
    }

    const newFullDataSource = getMapBackTestData(
      mappedData,
      dataSource,
      fullDataSource
    );
    const newData = getDataSource(newFullDataSource, filters);

    return {
      fullDataSource: newFullDataSource,
      newData,
    };
  };

  useEffect(() => {
    getData('supabase');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

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
            onClick={() => getData('supabase')}
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

  console.log(dataSource, 'dataSource', fullDataSource, 'fullDataSource');

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
        dataSource={dataSource}
        fullDataSource={fullDataSource}
        open={openDrawerTesting}
        cbSetLoading={(data) => setLoading(data)}
        cbSetDataSource={(data) => setDataSource(data)}
        cbGetDataFromFireant={() => getData('fireant')}
        cbBackTestHeroku={() =>
          getBackTestDataOffline({
            database: 'heroku',
            dataSource,
            fullDataSource,
          })
        }
        cbBackTestSupabase={() =>
          getBackTestDataOffline({
            database: 'supabase',
            dataSource,
            fullDataSource,
          })
        }
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
};

export default StockTable;
