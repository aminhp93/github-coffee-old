import { StockService } from 'libs/services';
import React, { useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { Watchlist } from 'libs/types';
import {
  RadioChangeEvent,
  Checkbox,
  Form,
  Radio,
  Switch,
  Table,
  Button,
  notification,
  Dropdown,
  Menu,
  Drawer,
  InputNumber,
  Tooltip,
} from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  getHistorialQuote,
  getFinancialIndicator,
  getFundamentals,
  getDailyTransaction,
  updateWatchlist,
  FinancialIndicatorsColumns,
  FundamentalColumns,
  HistoricalQuoteColumns,
  NoDataColumns,
  getFilterData,
} from './utils';
import {
  UNIT_BILLION,
  MIN_CHANGE,
  MAX_CHANGE,
  DELAY_TIME,
  TYPE_INDICATOR_OPTIONS,
  DEFAULT_TYPE_INDICATOR_OPTIONS,
} from './constants';
import {
  CheckCircleOutlined,
  SettingOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import './StockTable.less';
import moment from 'moment';
import { useInterval } from 'libs/hooks';
import BuySellSignalsColumns from './BuySellSignalsColumns';

const DEFAULT_FILTER = {
  totalValue_last20_min: 0,
  totalValue_last20_max: 99999,
  changeVolume_last5_min: MIN_CHANGE,
  changeVolume_last5_max: MAX_CHANGE,
  changeVolume_last20_min: MIN_CHANGE,
  changeVolume_last20_max: MAX_CHANGE,
  transaction_above_1_bil_min: 0,
  transaction_above_1_bil_max: 99999,
  changePrice_min: MIN_CHANGE,
  changePrice_max: MAX_CHANGE,
  excludeVN30: false,
  validCount_5_day_within_base: false,
};

const InDayReviewColumns = [
  {
    title: 'trans_<_1_ty',
    sorter: (a: any, b: any) =>
      a.transaction_upto_1_bil &&
      b.transaction_upto_1_bil &&
      a.transaction_upto_1_bil.length - b.transaction_upto_1_bil.length,
    align: 'right',
    render: (data: any) => {
      const transaction_upto_1_bil = data.transaction_upto_1_bil || [];
      return (
        <Tooltip
          title={
            <div>
              {transaction_upto_1_bil.map((i: any) => {
                return (
                  <div>
                    {moment(i.Date).format('HH:mm:ss')} -{' '}
                    {Number(
                      ((i.Volume * i.Price * 10) / UNIT_BILLION).toFixed(1)
                    ).toLocaleString()}
                  </div>
                );
              })}
            </div>
          }
        >
          <div>{transaction_upto_1_bil.length}</div>
        </Tooltip>
      );
    },
  },
  {
    title: 'trans_>_1_ty',
    sorter: (a: any, b: any) =>
      a.transaction_above_1_bil &&
      b.transaction_above_1_bil &&
      a.transaction_above_1_bil.length - b.transaction_above_1_bil.length,
    align: 'right',
    render: (data: any) => {
      const transaction_above_1_bil = data.transaction_above_1_bil || [];
      return (
        <Tooltip
          title={
            <div>
              {transaction_above_1_bil.map((i: any) => {
                return (
                  <div>
                    {moment(i.Date).format('HH:mm:ss')} -{' '}
                    {Number(
                      ((i.Volume * i.Price) / UNIT_BILLION).toFixed(1)
                    ).toLocaleString()}
                  </div>
                );
              })}
            </div>
          }
        >
          <div> {transaction_above_1_bil.length}</div>
        </Tooltip>
      );
    },
  },
  {
    title: 'buy_sell_count',
    align: 'right',
    // sorter: (a: any, b: any) => a.buy_sell_vol - b.buy_sell_vol,
    render: (data: any) => {
      const buy_sell_count_ratio = data.buy_sell_vol?.buy_sell_count_ratio || 0;
      const buy_count = data.buy_sell_vol?.buy_count || 0;
      const sell_count = data.buy_sell_vol?.sell_count || 0;
      return (
        <Tooltip title={`${buy_count} / ${sell_count}`}>
          <div className={buy_sell_count_ratio > 1 ? 'green' : 'red'}>
            {buy_sell_count_ratio}
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: 'buy_sell_vol',
    align: 'right',
    // sorter: (a: any, b: any) => a.buy_sell_vol - b.buy_sell_vol,
    render: (data: any) => {
      const buy_sell_total_ratio = data.buy_sell_vol?.buy_sell_total_ratio || 0;
      const total_buy_vol = data.buy_sell_vol?.total_buy_vol || 0;
      const total_sell_vol = data.buy_sell_vol?.total_sell_vol || 0;
      return (
        <Tooltip title={`${total_buy_vol} / ${total_sell_vol}`}>
          <div className={buy_sell_total_ratio > 1 ? 'green' : 'red'}>
            {buy_sell_total_ratio}
          </div>
        </Tooltip>
      );
    },
  },
];

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const CheckboxGroup = Checkbox.Group;

export default function StockTable() {
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);

  const [listWatchlist, setListWatchlist] = React.useState([]);
  const [currentWatchlist, setCurrentWatchlist] =
    React.useState<Watchlist | null>(null);

  const [dataSource, setDataSource] = React.useState([]);

  const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');

  const [bordered, setBordered] = useState(true);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('small');
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string | undefined>('scroll');
  const [columns, setColumns] = useState<ColumnsType<DataType>>([]);

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(
    DEFAULT_TYPE_INDICATOR_OPTIONS
  );
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [totalValue_last20_min, setTotalValue_last20_min] = useState<number>(
    DEFAULT_FILTER.totalValue_last20_min
  );
  const [totalValue_last20_max, setTotalValue_last20_max] = useState<number>(
    DEFAULT_FILTER.totalValue_last20_max
  );
  const [changeVolume_last5_min, setChangeVolume_last5_min] = useState<number>(
    DEFAULT_FILTER.changeVolume_last5_min
  );
  const [changeVolume_last5_max, setChangeVolume_last5_max] = useState<number>(
    DEFAULT_FILTER.changeVolume_last5_max
  );
  const [changeVolume_last20_min, setChangeVolume_last20_min] =
    useState<number>(DEFAULT_FILTER.changeVolume_last20_min);
  const [changeVolume_last20_max, setChangeVolume_last20_max] =
    useState<number>(DEFAULT_FILTER.changeVolume_last20_max);
  const [transaction_above_1_bil_min, setTransaction_above_1_bil_min] =
    useState<number>(DEFAULT_FILTER.transaction_above_1_bil_min);
  const [transaction_above_1_bil_max, setTransaction_above_1_bil_max] =
    useState<number>(DEFAULT_FILTER.transaction_above_1_bil_max);
  const [changePrice_min, setChangePrice_min] = useState<number>(
    DEFAULT_FILTER.changePrice_min
  );
  const [changePrice_max, setChangePrice_max] = useState<number>(
    DEFAULT_FILTER.changePrice_max
  );
  const [excludeVN30, setExcludeVN30] = useState(DEFAULT_FILTER.excludeVN30);
  const [validCount_5_day_within_base, setValidCount_5_day_within_base] =
    useState(DEFAULT_FILTER.validCount_5_day_within_base);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(DELAY_TIME);

  useInterval(
    async () => {
      const res = await handleGetData();
      const filteredRes = getFilterData(res, {
        totalValue_last20_min,
        totalValue_last20_max,
        changeVolume_last5_min,
        changeVolume_last5_max,
        changeVolume_last20_min,
        changeVolume_last20_max,
        changePrice_min,
        changePrice_max,
        excludeVN30,
        validCount_5_day_within_base,
        transaction_above_1_bil_min,
        transaction_above_1_bil_max,
      });
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

  const handleBorderChange = (enable: boolean) => {
    setBordered(enable);
  };

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  const handleTableLayoutChange = (e: RadioChangeEvent) => {
    setTableLayout(e.target.value);
  };

  const handleEllipsisChange = (enable: boolean) => {
    setEllipsis(enable);
  };

  const handleHeaderChange = (enable: boolean) => {
    setShowHeader(enable);
  };

  const handleFooterChange = (enable: boolean) => {
    setShowFooter(enable);
  };

  const handleYScrollChange = (enable: boolean) => {
    setYScroll(enable);
  };

  const handleXScrollChange = (e: RadioChangeEvent) => {
    setXScroll(e.target.value);
  };

  const handleDataChange = (newHasData: boolean) => {
    setHasData(newHasData);
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

    dataSource.forEach((j: any) => {
      listPromises.push(getHistorialQuote(j.symbol));
      listPromises.push(getFundamentals(j.symbol));
      listPromises.push(getFinancialIndicator(j.symbol));
      listPromises.push(getDailyTransaction(j.symbol));
    });

    setLoading(true);
    return Promise.all(listPromises)
      .then((res: any) => {
        setLoading(false);
        let newDataSource: any = [...dataSource];
        newDataSource = newDataSource.map((i: any) => {
          const filterRes = res.filter((j: any) => j.symbol === i.symbol);
          let newItem = { ...i };
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

  const handleClearFilter = () => {
    setTotalValue_last20_min(DEFAULT_FILTER.totalValue_last20_min);
    setTotalValue_last20_max(DEFAULT_FILTER.totalValue_last20_max);
    setChangeVolume_last5_min(DEFAULT_FILTER.changeVolume_last5_min);
    setChangeVolume_last5_max(DEFAULT_FILTER.changeVolume_last5_max);
    setChangeVolume_last20_min(DEFAULT_FILTER.changeVolume_last20_min);
    setChangeVolume_last20_max(DEFAULT_FILTER.changeVolume_last20_max);
    setTransaction_above_1_bil_min(DEFAULT_FILTER.transaction_above_1_bil_min);
    setTransaction_above_1_bil_max(DEFAULT_FILTER.transaction_above_1_bil_max);
    setChangePrice_min(DEFAULT_FILTER.changePrice_min);
    setChangePrice_max(DEFAULT_FILTER.changePrice_max);
    setExcludeVN30(DEFAULT_FILTER.excludeVN30);
    setValidCount_5_day_within_base(
      DEFAULT_FILTER.validCount_5_day_within_base
    );
  };

  const handleSetFilter = () => {
    setChangePrice_min(2);
    setExcludeVN30(true);
    setValidCount_5_day_within_base(true);
  };

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '90vw';
  }

  const tableColumns: any = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps: TableProps<DataType> = {
    bordered,
    loading,
    size,
    showSorterTooltip: false,
    pagination: {
      position: ['bottomRight'],
      pageSizeOptions: ['10', '20', '30'],
      showSizeChanger: true,
    },
    showHeader,
    footer: showfooter
      ? () => {
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
        }
      : undefined,
    scroll,
    tableLayout,
  };

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
        children: BuySellSignalsColumns,
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
  }, [checkedList]);

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

  console.log(
    dataSource,
    totalValue_last20_min,
    totalValue_last20_max,
    changeVolume_last5_min,
    changeVolume_last5_max,
    changeVolume_last20_min,
    changeVolume_last20_max,
    changePrice_min,
    changePrice_max
  );

  const filteredData = getFilterData(dataSource, {
    totalValue_last20_min,
    totalValue_last20_max,
    changeVolume_last5_min,
    changeVolume_last5_max,
    changeVolume_last20_min,
    changeVolume_last20_max,
    changePrice_min,
    changePrice_max,
    excludeVN30,
    validCount_5_day_within_base,
    transaction_above_1_bil_min,
    transaction_above_1_bil_max,
  });

  return (
    <div className="StockTable">
      <div>
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
        </div>

        <Table
          {...tableProps}
          columns={columns}
          dataSource={hasData ? filteredData : []}
          scroll={scroll}
        />
      </div>
      <Drawer
        title="Settings"
        placement="bottom"
        onClose={() => setOpenDrawerSettings(false)}
        open={openDrawerSettings}
      >
        <div
          className="height-100"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <Form
            layout="inline"
            className="components-table-demo-control-bar"
            style={{ marginBottom: 16 }}
          >
            <Form.Item label="Bordered">
              <Switch checked={bordered} onChange={handleBorderChange} />
            </Form.Item>
            <Form.Item label="loading">
              <Switch checked={loading} onChange={handleLoadingChange} />
            </Form.Item>
            <Form.Item label="Column Header">
              <Switch checked={showHeader} onChange={handleHeaderChange} />
            </Form.Item>
            <Form.Item label="Footer">
              <Switch checked={showfooter} onChange={handleFooterChange} />
            </Form.Item>
            <Form.Item label="Fixed Header">
              <Switch checked={!!yScroll} onChange={handleYScrollChange} />
            </Form.Item>
            <Form.Item label="Has Data">
              <Switch checked={!!hasData} onChange={handleDataChange} />
            </Form.Item>
            <Form.Item label="Ellipsis">
              <Switch checked={!!ellipsis} onChange={handleEllipsisChange} />
            </Form.Item>
            <Form.Item label="Size">
              <Radio.Group value={size} onChange={handleSizeChange}>
                <Radio.Button value="large">Large</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Table Scroll">
              <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                <Radio.Button value={undefined}>Unset</Radio.Button>
                <Radio.Button value="scroll">Scroll</Radio.Button>
                <Radio.Button value="fixed">Fixed Columns</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Table Layout">
              <Radio.Group
                value={tableLayout}
                onChange={handleTableLayoutChange}
              >
                <Radio.Button value={undefined}>Unset</Radio.Button>
                <Radio.Button value="fixed">Fixed</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
      <Drawer
        title="Filter"
        placement="bottom"
        className="StockTableFilterDrawer"
        onClose={() => setOpenDrawerFilter(false)}
        open={openDrawerFilter}
      >
        <div
          className="flex height-100"
          style={{ justifyContent: 'space-between' }}
        >
          <div
            className="flex"
            style={{ justifyContent: 'space-between', flexDirection: 'column' }}
          >
            <div>
              <div className="flex">
                <InputNumber
                  addonBefore="totalValue_last20_min"
                  value={totalValue_last20_min}
                  onChange={(value: any) => setTotalValue_last20_min(value)}
                />
                <InputNumber
                  style={{ marginLeft: '10px' }}
                  addonBefore="totalValue_last20_max"
                  value={totalValue_last20_max}
                  onChange={(value: any) => setTotalValue_last20_max(value)}
                />
              </div>
              <div className="flex" style={{ marginTop: '10px' }}>
                <InputNumber
                  addonBefore="changeVolume_last5_min"
                  value={changeVolume_last5_min}
                  onChange={(value: any) => setChangeVolume_last5_min(value)}
                />
                <InputNumber
                  style={{ marginLeft: '10px' }}
                  addonBefore="changeVolume_last5_max"
                  value={changeVolume_last5_max}
                  onChange={(value: any) => setChangeVolume_last5_max(value)}
                />
              </div>
              <div className="flex" style={{ marginTop: '10px' }}>
                <InputNumber
                  addonBefore="changeVolume_last20_min"
                  value={changeVolume_last20_min}
                  onChange={(value: any) => setChangeVolume_last20_min(value)}
                />
                <InputNumber
                  style={{ marginLeft: '10px' }}
                  addonBefore="changeVolume_last20_max"
                  value={changeVolume_last20_max}
                  onChange={(value: any) => setChangeVolume_last20_max(value)}
                />
              </div>
              <div className="flex" style={{ marginTop: '10px' }}>
                <InputNumber
                  addonBefore="changePrice_min"
                  value={changePrice_min}
                  onChange={(value: any) => setChangePrice_min(value)}
                />
                <InputNumber
                  style={{ marginLeft: '10px' }}
                  addonBefore="changePrice_max"
                  value={changePrice_max}
                  onChange={(value: any) => setChangePrice_max(value)}
                />
              </div>
              <div className="flex" style={{ marginTop: '10px' }}>
                <InputNumber
                  addonBefore="transaction_above_1_bil_min"
                  value={transaction_above_1_bil_min}
                  onChange={(value: any) =>
                    setTransaction_above_1_bil_min(value)
                  }
                />
                <InputNumber
                  style={{ marginLeft: '10px' }}
                  addonBefore="transaction_above_1_bil_max"
                  value={transaction_above_1_bil_max}
                  onChange={(value: any) =>
                    setTransaction_above_1_bil_max(value)
                  }
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Switch
                  checkedChildren="Exclude VN30"
                  unCheckedChildren="Exclude VN30"
                  checked={excludeVN30}
                  onChange={() => setExcludeVN30(!excludeVN30)}
                />
              </div>
              <div style={{ marginTop: '8px' }}>
                <Switch
                  checkedChildren="validCount_5_day_within_base"
                  unCheckedChildren="validCount_5_day_within_base"
                  checked={validCount_5_day_within_base}
                  onChange={() =>
                    setValidCount_5_day_within_base(
                      !validCount_5_day_within_base
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div
            className="flex"
            style={{ justifyContent: 'space-between', flexDirection: 'column' }}
          >
            <Button onClick={handleSetFilter}>Formula 1</Button>

            <Button danger onClick={handleClearFilter}>
              Clear filter
            </Button>
          </div>
          <div>
            <Button onClick={() => handleUpdateWatchlist()}>
              Update watchlist
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
