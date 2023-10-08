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
import { useEffect, useRef, useState, useCallback } from 'react';
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

const StockTable = () => {
  const gridRef: React.RefObject<AgGridReact> = useRef(null);

  const stockInfo = useStockStore((state) => state.stockInfo);

  const [openDrawerSettings, setOpenDrawerSettings] = useState(false);
  const [openDrawerStockAnalysis, setOpenDrawerStockTrendingD] =
    useState(false);
  const [openDrawerResultUpdate, setOpenDrawerResultUpdate] = useState(false);
  const [date, setDate] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [listStockBase, setListStockBase] = useState<StockBase[]>([]);
  const [allStocks, setAllStocks] = useState<StockData[]>([]);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);
  const [resultUpdate, setResultUpdate] = useState<any>({});
  const [filter, setFilter] = useState({
    exclude_is_blacklist: true,
    exclude_is_unpotential: true,
  });

  const handleChangeDate = useCallback((data: dayjs.Dayjs | null) => {
    if (!data) return;
    setDate(data);
  }, []);

  const getData = useCallback(
    async (data: dayjs.Dayjs | undefined) => {
      try {
        if (!data) return;
        gridRef.current?.api?.showLoadingOverlay();

        const resStockBase = await StockService.getAllStockBase();

        let listData = (resStockBase.data ?? []) as StockBase[];

        if (filter.exclude_is_blacklist) {
          listData = listData.filter((i) => !i.is_blacklist);
        }

        if (filter.exclude_is_unpotential) {
          listData = listData.filter((i) => !i.is_unpotential);
        }

        const listSymbols = listData.map((i) => i.symbol);

        let resFireant = await getTodayData(data, listSymbols);

        const res = await StockService.getStockDataFromSupabase({
          startDate: data.add(-1, 'month').format(DATE_FORMAT),
          endDate: data.format(DATE_FORMAT),
          listSymbols,
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

        const filterdData = filterData(mappedNewAllStocks);

        if (resStockBase?.data?.length) {
          setListStockBase(resStockBase.data as StockBase[]);
        }

        setAllStocks(filterdData);
      } catch (e) {
        gridRef.current?.api?.hideOverlay();
        notification.error({ message: 'error' });
      }
    },
    [filter.exclude_is_blacklist, filter.exclude_is_unpotential]
  );

  useEffect(() => {
    (async () => {
      try {
        if (!stockInfo) return;
        const resStockBase = await StockService.getAllStockBase();
        if (!resStockBase.data) return;

        const list_all = resStockBase.data.map((i) => i.symbol);

        const lastUpdated = stockInfo.last_updated;
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
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
  }, [stockInfo]);

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

  useEffect(() => {
    getData(date);
  }, [filter, date, getData]);

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
          <RefreshButton onClick={() => getData(date)} />

          <DatePicker
            style={{ marginLeft: 8 }}
            size="small"
            value={date}
            onChange={handleChangeDate}
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
        <StockTableSetting
          defaultFilter={filter}
          onClose={() => setOpenDrawerSettings(false)}
          onChangeFilter={(newFilter) => {
            setFilter(newFilter);
          }}
        />
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
