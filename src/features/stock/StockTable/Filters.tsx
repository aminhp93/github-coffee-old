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
  Radio,
} from 'antd';
import { useState } from 'react';
import {
  DATE_FORMAT,
  DEFAULT_FILTER,
  TYPE_INDICATOR_OPTIONS,
  DEFAULT_TYPE_INDICATOR_OPTIONS,
  DELAY_TIME,
  getColumns,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import './index.less';
import ReactMarkdown from 'react-markdown';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { keyBy } from 'lodash';
import { Watchlist } from '../types';
import { useInterval } from '@/hooks';

const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

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

  // count_5_day_within_base
  const [have_base_in_5_day, setHave_base_in_5_day] = useState(
    DEFAULT_FILTER.have_base_in_5_day
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
  const [sourceData, setSourceData] = useState<'fireant' | 'supabase' | string>(
    localStorage.getItem('sourceData') || 'fireant'
  );

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
    setHave_base_in_5_day(DEFAULT_FILTER.have_base_in_5_day);
    setEstimated_vol_change_min(DEFAULT_FILTER.estimated_vol_change_min);
    setHave_extra_vol(DEFAULT_FILTER.have_extra_vol);
    onChange(DEFAULT_FILTER);
  };

  const handleSetFilter = () => {
    setChangePrice_min(2);
    onChange({ changePrice_min: 2 });
  };

  const handleChangeDate = (dates: any) => {
    if (dates && onDateChange) {
      onDateChange(dates);
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
        <div
          className="width-100 flex"
          style={{ justifyContent: 'space-between' }}
        >
          <div>Filter</div>
          <div>
            <RangePicker
              size="small"
              onChange={handleChangeDate}
              defaultValue={[DEFAULT_START_DATE, DEFAULT_END_DATE]}
              format={DATE_FORMAT}
            />
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              onClick={() => setPlaying(!isPlaying)}
            >
              {isPlaying ? 'Stop Interval' : 'Start Interval'}
            </Button>
            <InputNumber
              size="small"
              style={{ marginLeft: '8px' }}
              disabled={isPlaying}
              value={delay}
              onChange={(value: any) => setDelay(value)}
            />
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              onClick={onUpdateWatchlist}
            >
              Update watchlist
            </Button>
          </div>
        </div>
      }
      placement="bottom"
      // width={'100%'}
      className="StockTableFilterDrawer"
      onClose={onClose}
      open={open}
    >
      <div
        className="flex height-100"
        style={{ justifyContent: 'space-between' }}
      >
        <div className="flex flex-1" style={{ flexDirection: 'column' }}>
          <div className="flex">
            <Dropdown overlay={menu} trigger={['hover']}>
              <Button size="small" style={{ marginRight: '8px' }}>
                {currentWatchlist?.name || 'Select watchlist'}
              </Button>
            </Dropdown>
          </div>
          <div style={{ marginTop: '20px' }}>
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
          <div style={{ marginTop: '20px' }}>
            <InputNumber
              size="small"
              addonBefore="changePrice_min"
              value={changePrice_min}
              onChange={(value: any) => {
                setChangePrice_min(value);
                onChange({ changePrice_min: value });
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Switch
              checkedChildren="have_base_in_5_day"
              unCheckedChildren="have_base_in_5_day"
              checked={have_base_in_5_day}
              onChange={() => {
                setHave_base_in_5_day(!have_base_in_5_day);
                onChange({ have_base_in_5_day: !have_base_in_5_day });
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
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
          <div style={{ marginTop: '20px' }}>
            <Switch
              checkedChildren="have_extra_vol"
              unCheckedChildren="have_extra_vol"
              checked={have_extra_vol}
              onChange={() => {
                setHave_extra_vol(!have_extra_vol);
                onChange({ have_extra_vol: !have_extra_vol });
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
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
          <div style={{ marginTop: '20px' }}>
            <Radio.Group
              value={sourceData}
              onChange={(e: any) => {
                setSourceData(e.target.value);
                localStorage.setItem('sourceData', e.target.value);
              }}
            >
              <Radio.Button value="fireant">Fireant</Radio.Button>
              <Radio.Button value="supabase">Supabase</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ marginTop: '20px' }}>
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
