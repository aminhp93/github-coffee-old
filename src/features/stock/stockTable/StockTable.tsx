/* eslint-disable @typescript-eslint/no-explicit-any */

// Import libaries
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SettingOutlined,
  StockOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, notification, Statistic, Tooltip } from 'antd';
import CustomAgGridReact from 'components/customAgGridReact/CustomAgGridReact';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { RowClassParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Import components
import { DATE_FORMAT } from '../constants';
import StockService from '../service';
import { StockData, SupabaseData, StockBase } from '../Stock.types';
import {
  filterData,
  getStockDataFromSupabase,
  getTodayData,
  mapDataFromStockBase,
  updateDataWithDate,
  mapNewAllStocks,
} from '../utils';
import RefreshButton from './RefreshButton';
import './StockTable.less';
import StockTableColumns from './StockTableColumns';
import StockTableSetting from './StockTableSetting';
import useStockStore from '../Stock.store';
import StockTrendingDrawer from './StockTrendingDrawer';
import StockResultUpdateDrawer from './StockResultUpdateDrawer';

const getRowClass = (params: RowClassParams) => {
  if (params.node.data.potential) {
    return 'potential-row';
  }
};

const { RangePicker } = DatePicker;

const StockTable = () => {
  // hooks
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerStockAnalysis, setOpenDrawerStockTrendingD] =
    useState(false);
  const [openDrawerResultUpdate, setOpenDrawerResultUpdate] = useState(false);

  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>();
  const [listStockBase, setListStockBase] = useState<StockBase[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);
  const [resultUpdate, setResultUpdate] = useState<any>({});

  const [filter] = useState({
    exclude_blacklist: true,
  });

  const handleChangeDate = (data: null | (dayjs.Dayjs | null)[]) => {
    if (!data || !data[0] || !data[1]) return;
    setDates(data as [dayjs.Dayjs, dayjs.Dayjs]);
    getData(data as [dayjs.Dayjs, dayjs.Dayjs]);
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

      const mappedNewAllStocks = mapNewAllStocks({
        stockData: newAllStocks,
        stockBase: resStockBase.data,
      });

      let excludeList: string[] = [];

      if (filter.exclude_blacklist) {
        excludeList = [...list_buyPoint, ...list_blacklist];
      }

      const filterdData = filterData({
        stockData: mappedNewAllStocks,
        exclude: excludeList,
      });

      if (resStockBase?.data?.length) {
        setListStockBase(resStockBase.data as StockBase[]);
      }

      setAllStocks(filterdData);
    } catch (e) {
      gridRef.current?.api?.hideOverlay();
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await StockService.getStockInfo();
        const resStockBase = await StockService.getAllStockBase();

        const { list_all } = mapDataFromStockBase(
          resStockBase.data || ([] as any)
        );

        if (res?.data?.length === 1) {
          const lastUpdated = res.data[0].last_updated;
          let newLastUpdated = dayjs().format(DATE_FORMAT);
          // check current time before 3pm
          if (dayjs().hour() < 15) {
            newLastUpdated = dayjs().add(-1, 'days').format(DATE_FORMAT);
          }

          if (lastUpdated !== newLastUpdated) {
            let nextCall = true;
            let offset = 0;
            setResultUpdate((pre: any) => {
              return { ...pre, list_all };
            });
            setOpenDrawerResultUpdate(true);
            while (nextCall) {
              const res = await updateDataWithDate(
                dayjs(lastUpdated).add(1, 'days').format(DATE_FORMAT),
                newLastUpdated,
                offset,
                list_all
              );
              console.log(res);
              setResultUpdate((pre: any) => ({
                ...pre,
                res: [...(pre.res || []), ...res],
              }));

              offset += 20;
              if (res?.length && res[0].length < 20) {
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
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleClickSymbol = (data: StockData) => {
    if (!data?.symbol) return;
    setSelectedSymbol(data?.symbol);
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
          <Tooltip title="Stock Trending">
            <Button
              size="small"
              type="primary"
              style={{ marginLeft: 8 }}
              icon={<StockOutlined />}
              onClick={() => setOpenDrawerStockTrendingD(true)}
            />
          </Tooltip>
        </div>
        <div className="flex" style={{ alignItems: 'center' }}>
          {allStocks.length}
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

  console.log({ allStocks });

  return (
    <div className="StockTable height-100 flex">
      <div className="height-100 width-100 ag-theme-alpine flex-1">
        <CustomAgGridReact
          ref={gridRef}
          columnDefs={StockTableColumns({
            handleClickSymbol,
            listStockBase,
          })}
          rowData={allStocks}
          getRowClass={getRowClass}
          onResize={handleResize}
          onGridReady={handleGridReady}
          enableRangeSelection={true}
          enableCharts={true}
        />
      </div>

      {footer()}

      {openDrawerResultUpdate && (
        <StockResultUpdateDrawer
          data={resultUpdate}
          onClose={() => setOpenDrawerResultUpdate(false)}
        />
      )}

      {openDrawerSettings && (
        <StockTableSetting onClose={() => setOpenDrawerSettings(false)} />
      )}

      {openDrawerStockAnalysis && (
        <StockTrendingDrawer
          onClose={() => setOpenDrawerStockTrendingD(false)}
        />
      )}
    </div>
  );
};

export default StockTable;
