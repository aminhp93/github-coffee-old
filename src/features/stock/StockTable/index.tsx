import moment from 'moment';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  SettingOutlined,
  WarningOutlined,
  BoldOutlined,
} from '@ant-design/icons';
import { Button, notification, Statistic, DatePicker, Tooltip } from 'antd';
import StockService from '../service';
import { useEffect, useState, useRef, useCallback } from 'react';
import { DEFAULT_FILTER, DEFAULT_SETTING, DATE_FORMAT } from '../constants';
import {
  filterData,
  updateDataWithDate,
  getStockDataFromSupabase,
} from '../utils';
import Filters from './Filter';
import './index.less';
import Settings from './Setting';
import Backtest from './Backtest';
import Testing from './Testing';
import { Filter, SupabaseData, StockData } from '../types';
import { AgGridReact } from 'ag-grid-react';
import StockTableColumns from './StockTableColumns';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import StockDetailChart from './StockDetailChart';
import RefreshButton from './RefreshButton';
const { RangePicker } = DatePicker;

const StockTable = () => {
  const gridRef: any = useRef();

  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [openDrawerBacktest, setOpenDrawerBacktest] = useState(false);
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [settings, setSettings] = useState(DEFAULT_SETTING);
  const [clickedSymbol, setClickedSymbol] = useState<string>('');
  const [dates, setDates] = useState<[moment.Moment, moment.Moment] | null>();
  const [listStockBase, setListStockBase] = useState<any[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const getAllStockBase = async () => {
    try {
      const res = await StockService.getAllStockBase();
      if (res.data && res.data.length) {
        setListStockBase(res.data);
      }
    } catch (error) {
      console.log('error', error);
    }
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

      gridRef.current.api && gridRef.current.api.showLoadingOverlay();

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);
      const tempStartDate = moment(endDate)
        .add(-1, 'months')
        .format(DATE_FORMAT);

      // get data

      // use latest data
      // For now only can use data from fireant
      let resFireant;
      if (
        dates[1].format(DATE_FORMAT) === moment().format(DATE_FORMAT) &&
        moment().hour() < 15
      ) {
        const res = await StockService.getStockDataFromFireant({
          startDate: moment().format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
        });
        resFireant = res.map((i) => {
          const item = i.data[0];
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
        });
      }

      // use old static data from supabase (updated 1 day ago)

      const res = await StockService.getStockDataFromSupabase({
        startDate: tempStartDate,
        endDate,
      });
      console.log('res', res);

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }
      console.log('source', source);

      const mappedData = getStockDataFromSupabase(source as SupabaseData[]);
      console.log('mappedData', mappedData);
      setAllStocks(mappedData);

      const filterdData = filterData(mappedData, filters);
      console.log('filterdData', filterdData);

      const listSymbols = filterdData.map((i) => i.symbol);

      const res2 = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
        listSymbols,
      });
      gridRef.current.api && gridRef.current.api.hideOverlay();
      console.log('res2', res2);

      let source2: any = res2.data;
      if (resFireant) {
        const filteredResFireant = resFireant.filter((i) =>
          listSymbols.includes(i.symbol)
        );
        source2 = [...filteredResFireant, ...source2];
      }
      console.log('source2', source2);

      const mappedData2 = getStockDataFromSupabase(source2 as SupabaseData[]);
      console.log('mappedData2', mappedData2);
      setListStocks(mappedData2);
    } catch (e) {
      console.log(e);
      gridRef.current.api && gridRef.current.api.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  useEffect(() => {
    updateData();
    getAllStockBase();
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
          <Tooltip title="Filter">
            <Button
              size="small"
              type="primary"
              icon={<FilterOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerFilter(true)}
            />
          </Tooltip>
        </div>
        <div className="flex" style={{ alignItems: 'center' }}>
          <RefreshButton
            onClick={() => {
              getAllStockBase();
              getData();
            }}
          />

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
          <AgGridReact
            rowData={listStocks}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
            }
            columnDefs={StockTableColumns({
              handleClickSymbol,
              handleClickBacktest,
              listStockBase,
            })}
            sideBar={{
              toolPanels: ['columns', 'filters'],
            }}
            onGridReady={onGridReady}
            ref={gridRef}
            defaultColDef={{
              editable: true,
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </div>
        <div className="height-100 width-100">
          <StockDetailChart dates={dates} symbol={clickedSymbol} />
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

      {openDrawerFilter && (
        <Filters
          onChange={(data: Filter) => setFilters({ ...filters, ...data })}
          onClose={() => setOpenDrawerFilter(false)}
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
