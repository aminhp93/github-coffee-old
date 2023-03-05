import CustomAgGridReact from 'components/CustomAgGridReact';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SupabaseData } from '../types';
import StockManagerColumns from './StockManagerColumns';
import StockService from '../service';
import { DATE_FORMAT, UNIT_BILLION } from '../constants';
import moment from 'moment';
import { getStockDataFromSupabase } from '../utils';
import { cloneDeep, keyBy, minBy } from 'lodash';
import './StockManager.less';
import { updateSelectedSymbol } from '../stockSlice';
import { useDispatch } from 'react-redux';
import { notification } from 'antd';

const StockManager = () => {
  const gridRef: any = useRef();
  const dispatch = useDispatch();

  const [listStocks, setListStocks] = useState<any[]>([]);

  const onGridReady = useCallback((params: any) => {
    gridRef.current.api.sizeColumnsToFit({
      defaultMinWidth: 100,
      columnLimits: [{ key: 'country', minWidth: 900 }],
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const resStockBase = await StockService.getAllStockBase();
      if (resStockBase.data) {
        const res = await StockService.getStockDataFromSupabase({
          startDate: moment().add(-30, 'days').format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
          listSymbols: resStockBase.data.map((i) => i.symbol),
        });

        let fundamental = await StockService.getFundamentalsDataFromFireant(
          resStockBase.data.map((i) => i.symbol)
        );

        const stockBaseObj = keyBy(resStockBase.data, 'symbol');

        const keyByFundamental = keyBy(fundamental, 'symbol');

        const newAllStocks = getStockDataFromSupabase(
          res.data as SupabaseData[]
        );
        console.log(newAllStocks, keyByFundamental);

        const newListStocks = newAllStocks.map((i) => {
          return {
            symbol: i.symbol,
            minValue: minBy(i.fullData, 'totalValue')?.totalValue,
            marketCap: keyByFundamental[i.symbol]?.marketCap,
            is_blacklist: stockBaseObj[i.symbol]?.is_blacklist,
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
    init();
  }, []);

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

  return (
    <div className="StockManager height-100 ag-theme-alpine width-100">
      <CustomAgGridReact
        rowData={listStocks}
        columnDefs={StockManagerColumns({
          handleClickSymbol,
          handleClickUpdate,
        })}
        onGridReady={onGridReady}
        getRowClass={getRowClass}
        ref={gridRef}
      />
    </div>
  );
};

export default StockManager;
