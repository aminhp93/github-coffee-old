import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { Button, DatePicker, notification, Statistic, Tooltip } from 'antd';
import CustomAgGridReact from 'components/customAgGridReact/CustomAgGridReact';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATE_FORMAT } from '../constants';
import StockService from '../service';
import { updateSelectedSymbol } from '../stockSlice';
import { StockData, SupabaseData } from '../types';
import {
  filterData,
  getStockDataFromSupabase,
  getTodayData,
  mapDataFromStockBase,
  updateDataWithDate,
} from '../utils';
import RefreshButton from './RefreshButton';
import './StockTable.less';
import StockTableColumns from './StockTableColumns';
import StockTableSetting from './StockTableSetting';
import { AgGridReact } from 'ag-grid-react';

const getRowClass = (params: any) => {
  if (params.node.data.potential) {
    return 'potential-row';
  }
};

const { RangePicker } = DatePicker;

const StockTable = () => {
  // hooks
  const dispatch = useDispatch();
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [listStocks, setListStocks] = useState<StockData[]>([]);
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>();
  const [listStockBase, setListStockBase] = useState<any[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);
  const [pinnedTopRowData, setPinnedTopRowData] = useState<StockData[]>([]);

  const handleChangeDate = (data: any) => {
    setDates(data);
    getData(data);
  };

  const getData = async (dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined) => {
    try {
      if (!dates || dates.length !== 2) return;
      gridRef.current?.api?.showLoadingOverlay();

      const resStockBase = await StockService.getAllStockBase();

      const { list_active, list_blacklist, list_buyPoint } =
        mapDataFromStockBase(resStockBase.data || ([] as any));

      let resFireant = await getTodayData(dates, list_active);

      const res = await StockService.getStockDataFromSupabase({
        startDate: dates[0].format(DATE_FORMAT),
        endDate: dates[1].format(DATE_FORMAT),
        listSymbols: list_active,
      });

      gridRef.current?.api?.hideOverlay();

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }

      const newAllStocks = getStockDataFromSupabase(source as SupabaseData[]);

      const filterdData = filterData(
        newAllStocks,
        [...list_buyPoint, ...list_blacklist],
        resStockBase.data
      );

      setPinnedTopRowData(
        newAllStocks
          .filter((i) => list_buyPoint.includes(i.symbol))
          .sort((a, b) => (a.change_t0 > b.change_t0 ? -1 : 1))
      );

      if (resStockBase.data && resStockBase.data.length) {
        setListStockBase(resStockBase.data);
      }

      setAllStocks(newAllStocks);
      setListStocks(filterdData);
    } catch (e) {
      gridRef.current?.api?.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res: any = await StockService.getLastUpdated();
        const resStockBase = await StockService.getAllStockBase();

        const { list_all } = mapDataFromStockBase(
          resStockBase.data || ([] as any)
        );
        if (res.data && res.data.length && res.data.length === 1) {
          const lastUpdated = res.data[0].last_updated;
          let newLastUpdated = dayjs().format(DATE_FORMAT);
          // check current time before 3pm
          if (dayjs().hour() < 15) {
            newLastUpdated = dayjs().add(-1, 'days').format(DATE_FORMAT);
          }

          if (lastUpdated !== newLastUpdated) {
            let nextCall = true;
            let offset = 0;

            while (nextCall) {
              const res = await updateDataWithDate(
                dayjs(lastUpdated).add(1, 'days').format(DATE_FORMAT),
                newLastUpdated,
                offset,
                list_all
              );
              offset += 20;
              if (res && res.length && res[0].length < 20) {
                nextCall = false;
              }
            }

            await StockService.updateLastUpdated({
              column: 'last_updated',
              value: newLastUpdated,
            });
          }

          setDates([dayjs().add(-1, 'month'), dayjs()]);
          getData([dayjs().add(-1, 'month'), dayjs()]);
        }
        notification.success({ message: 'success' });
      } catch (e) {
        notification.error({ message: 'error' });
      }
    };
    init();
  }, []);

  const handleResize = () => {
    if (!gridRef?.current?.api) return;
    gridRef.current.api.sizeColumnsToFit();
  };

  const handleGridReady = () => {
    if (!gridRef?.current?.api) return;
    gridRef.current.api.setFilterModel({
      is_blacklist: {
        type: 'set',
        values: ['false'],
      },
    });
    gridRef.current.api.sizeColumnsToFit();
  };

  const handleClickSymbol = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    dispatch(updateSelectedSymbol(data.data.symbol));
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
          <Tooltip title="Setting">
            <Button
              size="small"
              type="primary"
              style={{ marginLeft: 8 }}
              icon={<SettingOutlined />}
              onClick={() => setOpenDrawerSettings(true)}
            />
          </Tooltip>
        </div>
        <div className="flex" style={{ alignItems: 'center' }}>
          <RefreshButton onClick={() => getData(dates)} />

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

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <CustomAgGridReact
          ref={gridRef}
          columnDefs={StockTableColumns({
            handleClickSymbol,
            listStockBase,
          })}
          rowData={listStocks}
          pinnedTopRowData={pinnedTopRowData}
          getRowClass={getRowClass}
          onResize={handleResize}
          onGridReady={handleGridReady}
        />
      </div>
      {footer()}

      {openDrawerSettings && (
        <StockTableSetting onClose={() => setOpenDrawerSettings(false)} />
      )}
    </div>
  );
};

export default StockTable;
