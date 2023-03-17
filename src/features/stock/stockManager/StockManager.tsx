import { WarningOutlined } from '@ant-design/icons';
import { Button, DatePicker, notification, Tooltip } from 'antd';
import CustomAgGridReact from 'components/CustomAgGridReact';
import dayjs from 'dayjs';
import { cloneDeep, keyBy, meanBy, minBy } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DATE_FORMAT, UNIT_BILLION } from '../constants';
import StockService from '../service';
import { updateSelectedSymbol } from '../stockSlice';
import RefreshButton from '../stockTable/RefreshButton';
import StockTesting from '../StockTesting';
import { SupabaseData } from '../types';
import { getStockDataFromSupabase } from '../utils';
import './StockManager.less';
import StockManagerColumns from './StockManagerColumns';

const { RangePicker } = DatePicker;

const StockManager = () => {
  const gridRef: any = useRef();
  const dispatch = useDispatch();

  const [listStocks, setListStocks] = useState<any[]>([]);
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>([
    dayjs().add(-1, 'years'),
    dayjs(),
  ]);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const onGridReady = useCallback((params: any) => {
    gridRef.current.api.sizeColumnsToFit({
      defaultMinWidth: 100,
      columnLimits: [{ key: 'country', minWidth: 900 }],
    });
  }, []);

  const getData = async (dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined) => {
    if (!dates || dates.length !== 2) return;
    const resStockBase = await StockService.getAllStockBase();
    if (resStockBase.data) {
      const res = await StockService.getStockDataFromSupabase({
        startDate: dates[0].format(DATE_FORMAT),
        endDate: dates[1].format(DATE_FORMAT),
        listSymbols: resStockBase.data.map((i) => i.symbol),
      });

      let fundamental = await StockService.getFundamentalsDataFromFireant(
        resStockBase.data.map((i) => i.symbol)
      );

      const stockBaseObj = keyBy(resStockBase.data, 'symbol');

      const keyByFundamental = keyBy(fundamental, 'symbol');

      const newAllStocks = getStockDataFromSupabase(res.data as SupabaseData[]);
      console.log(newAllStocks, keyByFundamental);

      const newListStocks = newAllStocks.map((i) => {
        return {
          symbol: i.symbol,
          minValue: minBy(i.fullData, 'totalValue')?.totalValue,
          marketCap: keyByFundamental[i.symbol]?.marketCap,
          is_blacklist: stockBaseObj[i.symbol]?.is_blacklist,
          averageChange: meanBy(i.fullData, (i) =>
            i.change_t0 > 0 ? i.change_t0 : -i.change_t0
          ),
          averageRangeChange: meanBy(i.fullData, 'rangeChange_t0'),
        };
      });

      newListStocks.forEach((i: any) => {
        if (
          i.minValue < 2 * UNIT_BILLION &&
          i.marketCap < 1000 * UNIT_BILLION &&
          !i.is_blacklist
        ) {
          i.danger = true;
        } else {
          i.danger = false;
        }
      });

      // sort by minValue
      newListStocks.sort((a: any, b: any) => {
        return a.minValue - b.minValue;
      });

      setListStocks(newListStocks);
    }
  };

  useEffect(() => {
    getData(dates);
  }, [dates]);

  const getRowClass = (params: any) => {
    if (params.node.data.danger) {
      return 'danger-row';
    }
  };

  const handleClickSymbol = (data: any) => {
    const symbol = data.data?.symbol;
    if (!symbol) return;
    dispatch(updateSelectedSymbol(data.data.symbol));
  };

  const handleClickUpdate = async (data: any) => {
    try {
      const updatedData = {
        symbol: data.data.symbol,
        is_blacklist: !data.data.is_blacklist,
      };
      await StockService.updateStockBase(updatedData);

      const newListStocks = cloneDeep(listStocks);
      const index = newListStocks.findIndex(
        (i) => i.symbol === data.data.symbol
      );
      newListStocks[index].is_blacklist = !data.data.is_blacklist;
      if (newListStocks[index].is_blacklist) {
        newListStocks[index].danger = false;
      } else {
        newListStocks[index].danger = true;
      }

      setListStocks(newListStocks);

      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const footer = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: 'space-between',
          height: '50px',
          alignItems: 'center',
        }}
      >
        <div className="flex" style={{ alignItems: 'center' }}>
          <Tooltip title="Testing">
            <Button
              size="small"
              type="primary"
              icon={<WarningOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerTesting(true)}
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
        </div>
      </div>
    );
  };

  return (
    <div
      className="StockManager height-100 ag-theme-alpine width-100 flex"
      style={{ flexDirection: 'column' }}
    >
      <div style={{ flex: 1 }}>
        <CustomAgGridReact
          rowData={listStocks}
          columnDefs={StockManagerColumns({
            handleClickSymbol,
            handleClickUpdate,
          })}
          pagination={true}
          paginationAutoPageSize={true}
          onGridReady={onGridReady}
          getRowClass={getRowClass}
          ref={gridRef}
        />
      </div>
      {footer()}
      {openDrawerTesting && (
        <StockTesting onClose={() => setOpenDrawerTesting(false)} />
      )}
    </div>
  );
};

export default StockManager;