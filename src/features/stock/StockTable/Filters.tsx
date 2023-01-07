import {
  Button,
  Drawer,
  InputNumber,
  Switch,
  DatePicker,
  Popover,
  Checkbox,
  Dropdown,
  Menu,
} from 'antd';
import { useState } from 'react';
import {
  DATE_FORMAT,
  DEFAULT_DATE,
  DEFAULT_FILTER,
  TYPE_INDICATOR_OPTIONS,
  DEFAULT_TYPE_INDICATOR_OPTIONS,
  DELAY_TIME,
} from '../constants';
import './index.less';
import ReactMarkdown from 'react-markdown';
import type { DatePickerProps } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { keyBy } from 'lodash';
import { Watchlist } from '../types';
import { useInterval } from 'libs/hooks';
import { getColumns } from '../utils';

const CheckboxGroup = Checkbox.Group;

const Filters = ({
  listWatchlist,
  onChange,
  onClose,
  onUpdateWatchlist,
  open,
  onDateChange,
  onGetData,
  onColumnChange,
}: any) => {
  // totalValue_last20_min
  const [totalValue_last20_min, setTotalValue_last20_min] = useState<number>(
    DEFAULT_FILTER.totalValue_last20_min
  );

  //   changePrice
  const [changePrice_min, setChangePrice_min] = useState<number>(
    DEFAULT_FILTER.changePrice_min
  );
  const [changePrice_max, setChangePrice_max] = useState<number>(
    DEFAULT_FILTER.changePrice_max
  );

  // count_5_day_within_base
  const [have_base_in_5_day, setHave_base_in_5_day] = useState(
    DEFAULT_FILTER.have_base_in_5_day
  );

  // count_10_day_within_base
  const [have_base_in_10_day, setHave_base_in_10_day] = useState(
    DEFAULT_FILTER.have_base_in_10_day
  );

  // count_10_day_buy
  const [count_10_day_buy_min, setCount_10_day_buy_min] = useState<number>(
    DEFAULT_FILTER.count_10_day_buy_min
  );

  // count_10_day_sell
  const [count_10_day_sell_min, setCount_10_day_sell_min] = useState<number>(
    DEFAULT_FILTER.count_10_day_sell_min
  );

  // estimated_vol_change
  const [estimated_vol_change_min, setEstimated_vol_change_min] =
    useState<number>(DEFAULT_FILTER.estimated_vol_change_min);

  // extra_vol
  const [have_extra_vol, setHave_extra_vol] = useState<boolean>(
    DEFAULT_FILTER.have_extra_vol
  );

  // only_buy_sell
  const [only_buy_sell, setOnly_buy_sell] = useState<boolean>(
    DEFAULT_FILTER.only_buy_sell
  );

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(
    DEFAULT_TYPE_INDICATOR_OPTIONS
  );

  const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist | null>(
    null
  );

  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(DELAY_TIME);

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

  useInterval(
    async () => {
      onGetData && onGetData();
      //  const res = await handleGetData();
      // const filteredRes = getFilterData(res, filters);
      // const symbols = filteredRes.map((item: any) => item.symbol);
      // handleUpdateWatchlist(symbols);
    },
    isPlaying ? delay : null
  );

  const handleClickMenuWatchlist = (e: any) => {
    const listWatchlistObj = keyBy(listWatchlist, 'watchlistID');

    setCurrentWatchlist(listWatchlistObj[e.key]);
  };

  const handleClearFilter = () => {
    setTotalValue_last20_min(DEFAULT_FILTER.totalValue_last20_min);
    setChangePrice_min(DEFAULT_FILTER.changePrice_min);
    setChangePrice_max(DEFAULT_FILTER.changePrice_max);
    setHave_base_in_5_day(DEFAULT_FILTER.have_base_in_5_day);
    setHave_base_in_10_day(DEFAULT_FILTER.have_base_in_10_day);
    setCount_10_day_buy_min(DEFAULT_FILTER.count_10_day_buy_min);
    setCount_10_day_sell_min(DEFAULT_FILTER.count_10_day_sell_min);
    setEstimated_vol_change_min(DEFAULT_FILTER.estimated_vol_change_min);
    setHave_extra_vol(DEFAULT_FILTER.have_extra_vol);
    onChange(DEFAULT_FILTER);
  };

  const handleSetFilter = () => {
    setChangePrice_min(2);
    setChangePrice_max(6);
    onChange({ changePrice_min: 2, changePrice_max: 6 });
  };

  const handleChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    if (date && onDateChange) {
      onDateChange(date);
    }
  };

  const handleChangeColumn = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(
      !!list.length && list.length < TYPE_INDICATOR_OPTIONS.length
    );
    setCheckAll(list.length === TYPE_INDICATOR_OPTIONS.length);
    const newColumns = getColumns(list);
    onColumnChange && onColumnChange(newColumns);
  };

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const newCheckedList = e.target.checked ? TYPE_INDICATOR_OPTIONS : [];
    setCheckedList(e.target.checked ? TYPE_INDICATOR_OPTIONS : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    const newColumns = getColumns(newCheckedList);
    onColumnChange && onColumnChange(newColumns);
  };

  return (
    <Drawer
      title={
        <div className="width-100 flex" style={{ justifyContent: 'flex-end' }}>
          <Button size="small" onClick={onUpdateWatchlist}>
            Update watchlist
          </Button>
        </div>
      }
      placement="right"
      width={'100%'}
      className="StockTableFilterDrawer"
      onClose={onClose}
      open={open}
    >
      <div
        className="flex height-100"
        style={{ justifyContent: 'space-between' }}
      >
        <div
          className="flex flex-1"
          style={{ justifyContent: 'space-between', flexDirection: 'column' }}
        >
          <div className="flex">
            <Dropdown overlay={menu} trigger={['hover']}>
              <Button size="small" style={{ marginRight: '8px' }}>
                {currentWatchlist?.name || 'Select watchlist'}
              </Button>
            </Dropdown>
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
          </div>
          <div className="flex">
            <DatePicker
              onChange={handleChangeDate}
              defaultValue={DEFAULT_DATE}
              format={DATE_FORMAT}
            />
          </div>

          <div className="flex">
            <InputNumber
              size="small"
              addonBefore="totalValue_last20_min"
              value={totalValue_last20_min}
              onChange={(value: any) => {
                setTotalValue_last20_min(value);
                onChange({ totalValue_last20_min: value });
              }}
            />
          </div>
          <div className="flex" style={{ marginTop: '10px' }}>
            <InputNumber
              size="small"
              addonBefore="changePrice_min"
              value={changePrice_min}
              onChange={(value: any) => {
                setChangePrice_min(value);
                onChange({ changePrice_min: value });
              }}
            />
            <InputNumber
              size="small"
              style={{ marginLeft: '10px' }}
              addonBefore="changePrice_max"
              value={changePrice_max}
              onChange={(value: any) => {
                setChangePrice_max(value);
                onChange({ changePrice_max: value });
              }}
            />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Switch
              checkedChildren="have_base_in_5_day"
              unCheckedChildren="have_base_in_5_day"
              checked={have_base_in_5_day}
              onChange={() => {
                setHave_base_in_5_day(!have_base_in_5_day);
                onChange({ have_base_in_5_day: !have_base_in_5_day });
              }}
            />

            <Switch
              checkedChildren="have_base_in_10_day"
              unCheckedChildren="have_base_in_10_day"
              checked={have_base_in_10_day}
              onChange={() => {
                setHave_base_in_10_day(!have_base_in_10_day);
                onChange({ have_base_in_10_day: !have_base_in_10_day });
              }}
            />
          </div>
          <div className="flex" style={{ marginTop: '10px' }}>
            <InputNumber
              size="small"
              addonBefore="count_10_day_buy_min"
              value={count_10_day_buy_min}
              onChange={(value: any) => {
                setCount_10_day_buy_min(value);
                onChange({ count_10_day_buy_min: value });
              }}
            />
          </div>
          <div className="flex" style={{ marginTop: '10px' }}>
            <InputNumber
              size="small"
              addonBefore="count_10_day_sell_min"
              value={count_10_day_sell_min}
              onChange={(value: any) => {
                setCount_10_day_sell_min(value);
                onChange({ count_10_day_sell_min: value });
              }}
            />
          </div>
          <div className="flex" style={{ marginTop: '10px' }}>
            <InputNumber
              size="small"
              addonBefore="estimated_vol_change_min"
              value={estimated_vol_change_min}
              onChange={(value: any) => {
                setEstimated_vol_change_min(value);
                onChange({ estimated_vol_change_min: value });
              }}
            />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Switch
              checkedChildren="have_extra_vol"
              unCheckedChildren="have_extra_vol"
              checked={have_extra_vol}
              onChange={() => {
                setHave_extra_vol(!have_extra_vol);
                onChange({ have_extra_vol: !have_extra_vol });
              }}
            />
            <Switch
              checkedChildren="only_buy_sell"
              unCheckedChildren="only_buy_sell"
              checked={only_buy_sell}
              onChange={() => {
                setOnly_buy_sell(!only_buy_sell);
                onChange({ only_buy_sell: !only_buy_sell });
              }}
            />
          </div>
          <div style={{ marginTop: '8px' }}>
            <Popover
              placement="leftTop"
              content={
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={handleCheckAllChange}
                    checked={checkAll}
                  >
                    All
                  </Checkbox>
                  <CheckboxGroup
                    options={TYPE_INDICATOR_OPTIONS}
                    value={checkedList}
                    onChange={handleChangeColumn}
                  />
                </div>
              }
            >
              <Button size="small" type="primary">
                Hover me
              </Button>
            </Popover>
          </div>
        </div>
        <div
          className="flex flex-1"
          style={{ justifyContent: 'space-between', flexDirection: 'column' }}
        >
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <div>
              <div>Description</div>
              <div>
                <ReactMarkdown
                  children={`
                - changePrice_min: 2
                - changePrice_max: 6
              `}
                />
              </div>
            </div>
            <Button size="small" onClick={handleSetFilter}>
              Formula 1
            </Button>
          </div>

          <Button size="small" danger onClick={handleClearFilter}>
            Clear filter
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Filters;
