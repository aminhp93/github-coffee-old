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
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import {
  getBackTestDataOffline,
  getDataSource,
  getDataFromSupabase,
  getDataFromFireant,
  updateDataWithDate,
} from '../utils';
import Filters from './Filters';
import './index.less';
import Settings from './Settings';
import Testing from './Testing';
import { CustomSymbol, Watchlist } from '../types';

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

      let res: any;
      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);
      setLoading(true);
      if (
        localStorage.getItem('sourceData') !== 'supabase' &&
        moment().format('HH:mm') < '15:00'
      ) {
        res = await getDataFromFireant({
          startDate,
          endDate: moment().format(DATE_FORMAT),
        });
      } else {
        res = await getDataFromSupabase({ startDate, endDate });
      }

      const newData = getDataSource(res, filters);

      const resBackTest = await getBackTestDataOffline({
        database: 'supabase',
        dataSource: newData,
        fullDataSource: res,
        filters,
      });

      setLoading(false);
      setFullDataSource(resBackTest.fullDataSource);
      setDataSource(resBackTest.dataSource);
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

  const _filter_1 = fullDataSource.filter(
    (i: CustomSymbol) => i.buySellSignals.changePrice < -0.02
  );
  const _filter_2 = fullDataSource.filter(
    (i: CustomSymbol) =>
      i.buySellSignals.changePrice >= -0.02 &&
      i.buySellSignals.changePrice <= 0.02
  );
  const _filter_3 = fullDataSource.filter(
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
        open={openDrawerTesting}
        onClose={() => setOpenDrawerTesting(false)}
      />
      <Filters
        open={openDrawerFilter}
        listWatchlist={listWatchlist}
        onChange={(data: any) => setFilters({ ...filters, ...data })}
        onDateChange={(newDates: [moment.Moment, moment.Moment]) =>
          setDates(newDates)
        }
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
