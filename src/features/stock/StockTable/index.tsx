import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SettingOutlined,
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
import { StockService } from 'libs/services';
import { Watchlist } from 'libs/types';
import { keyBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_TYPE_INDICATOR_OPTIONS,
  DELAY_TIME,
  TYPE_INDICATOR_OPTIONS,
} from '../constants';
import {
  FinancialIndicatorsColumns,
  FundamentalColumns,
  // getDailyTransaction,
  getFilterData,
  getFinancialIndicator,
  getFundamentals,
  getHistorialQuote,
  HistoricalQuoteColumns,
  NoDataColumns,
  updateWatchlist,
} from '../utils';
import BuySellSignalsColumns from './BuySellSignalsColumns';
import Filters from './Filters';
import InDayReviewColumns from './InDayReviewColumns';
import './index.less';
import Settings from './Settings';

const CheckboxGroup = Checkbox.Group;

export default function StockTable() {
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);

  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] =
    React.useState<Watchlist | null>(null);

  const [dataSource, setDataSource] = React.useState([]);

  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');

  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState<ColumnsType<any>>([]);

  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState({});

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

      await updateWatchlist(watchlistObj, updateData);
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

    if (!thanh_khoan_vua_wl) return;

    thanh_khoan_vua_wl.symbols.forEach((j: any) => {
      listPromises.push(getHistorialQuote(j));
      listPromises.push(getFundamentals(j));
      listPromises.push(getFinancialIndicator(j));
      // listPromises.push(getDailyTransaction(j));
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
              newItem = { ...newItem, ...j };
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

  const filteredData = useMemo(
    () => getFilterData(dataSource, filters),
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
        children: HistoricalQuoteColumns,
      });
    }

    if (checkedList.includes('Fundamental')) {
      columns.push({
        title: 'Fundamentals',
        children: FundamentalColumns,
      });
    }

    if (checkedList.includes('FinancialIndicators')) {
      columns.push({
        title: 'FinancialIndicators',
        children: FinancialIndicatorsColumns,
      });
    }

    if (checkedList.includes('BuySellSignals')) {
      columns.push({
        title: 'BuySellSignals',
        children: BuySellSignalsColumns(filteredData),
      });
    }

    if (checkedList.includes('NoData')) {
      columns.push({
        title: 'NoData',
        children: NoDataColumns,
      });
    }

    if (checkedList.includes('InDayReview')) {
      columns.push({
        title: 'InDayReview',
        children: InDayReviewColumns,
      });
    }

    setColumns(columns);
  }, [checkedList, filteredData]);

  useEffect(() => {
    (async () => {
      const res = await StockService.getWatchlist();
      if (res && res.data) {
        setListWatchlist(res.data);
      }
    })();
  }, []);

  const menu = (
    <Menu onClick={handleClickMenuWatchlist}>
      {listWatchlist.map((i: any) => {
        return (
          <Menu.Item disabled={i.name === 'all'} key={i.watchlistID}>
            {i.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  console.log(dataSource, filters);

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="flex">
          <Dropdown overlay={menu} trigger={['hover']}>
            <Button style={{ marginRight: '8px' }}>
              {currentWatchlist?.name || 'Select watchlist'}
            </Button>
          </Dropdown>
          <Button
            icon={<CheckCircleOutlined />}
            disabled={loading}
            onClick={handleGetData}
          />
          <div style={{ marginLeft: '8px' }}>
            <Button onClick={() => setPlaying(!isPlaying)}>
              {isPlaying ? 'Stop Interval' : 'Start Interval'}
            </Button>

            <InputNumber
              style={{ marginLeft: '8px' }}
              disabled={isPlaying}
              value={delay}
              onChange={(value: any) => setDelay(value)}
            />
          </div>
        </div>
        <div className={'flex'}>
          <Statistic
            title="Buy > 2%"
            value={_filter_3.length}
            valueStyle={{ color: 'green' }}
            prefix={<ArrowUpOutlined />}
          />
          <Statistic
            title="Normal"
            value={_filter_2.length}
            style={{ margin: '0 10px' }}
          />

          <Statistic
            title="Sell < -2%"
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
          <Button type="primary">Hover me</Button>
        </Popover>
      </div>
    );
  };

  const _filter_1 = dataSource.filter((i: any) => i.changePrice < -0.02);
  const _filter_2 = dataSource.filter(
    (i: any) => i.changePrice >= -0.02 && i.changePrice <= 0.02
  );
  const _filter_3 = dataSource.filter((i: any) => i.changePrice > 0.02);

  const handleChangeFilters = (data: any) => {
    setFilters({ ...filters, ...data });
  };

  const handleChangeSettings = (data: any) => {
    setSettings({ ...settings, ...data });
  };

  return (
    <div className="StockTable">
      <div>
        {renderHeader()}

        <Table
          {...settings}
          showSorterTooltip={false}
          pagination={{
            position: ['bottomRight'],
            pageSizeOptions: ['10', '20', '30'],
            showSizeChanger: true,
          }}
          columns={columns}
          dataSource={filteredData}
          footer={() => {
            return (
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <div>{String(filteredData.length)}</div>
                <div>
                  <Button
                    type="primary"
                    icon={<SettingOutlined />}
                    onClick={() => setOpenDrawerSettings(true)}
                  />
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    style={{ marginLeft: 8 }}
                    onClick={() => setOpenDrawerFilter(true)}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
      <Filters
        open={openDrawerFilter}
        onChange={handleChangeFilters}
        onUpdateWatchlist={handleUpdateWatchlist}
        onClose={() => setOpenDrawerFilter(false)}
      />
      <Settings
        open={openDrawerSettings}
        onChange={handleChangeSettings}
        onClose={() => setOpenDrawerSettings(false)}
      />
    </div>
  );
}
