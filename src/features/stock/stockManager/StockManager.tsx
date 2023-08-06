/* eslint-disable @typescript-eslint/no-explicit-any */
// Import libaries
import { WarningOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Button, DatePicker, notification, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';

// Import services
import CustomAgGridReact from 'components/customAgGridReact/CustomAgGridReact';
import { DATE_FORMAT } from '../constants';
import StockService from '../service';
import RefreshButton from '../stockTable/RefreshButton';
import StockTesting from '../StockTesting';
import './StockManager.less';
import StockManagerColumns from './StockManagerColumns';
import useStockStore from '../Stock.store';
import { getRowClass, getData } from './StockManager.utils';
import StockLastUpdated from '../StockLastUpdated';

const { RangePicker } = DatePicker;

const StockManager = () => {
  const gridRef: React.RefObject<AgGridReact> = useRef(null);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);

  const [listStocks, setListStocks] = useState<any[]>([]);
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>([
    dayjs().add(-3, 'month'),
    dayjs(),
  ]);
  const [openDrawerTesting, setOpenDrawerTesting] = useState(false);
  const [openDrawerLastUpdated, setOpenDrawerLastUpdated] = useState(false);

  const handleChangeDate = (data: null | (dayjs.Dayjs | null)[]) => {
    if (!data || !data[0] || !data[1]) return;
    setDates(data as [dayjs.Dayjs, dayjs.Dayjs]);
  };

  const handleGetData = useCallback(
    async (dates: dayjs.Dayjs[] | undefined) => {
      try {
        gridRef.current?.api?.showLoadingOverlay();

        const res: any = await getData(dates);
        gridRef.current?.api?.hideOverlay();

        setListStocks(res);
      } catch (e) {
        gridRef.current?.api?.hideOverlay();

        console.log(e);
        notification.error({ message: 'error' });
      }
    },
    []
  );

  useEffect(() => {
    handleGetData(dates);
  }, [dates, handleGetData]);

  const handleClickSymbol = (data: any) => {
    if (!data?.symbol) return;
    setSelectedSymbol(data.symbol);
  };

  const handleClickUpdate = async (data: any) => {
    try {
      const updatedData = {
        symbol: data.symbol,
        is_blacklist: !data.is_blacklist,
      };
      await StockService.updateStockBase(updatedData);

      const newListStocks = cloneDeep(listStocks);
      const index = newListStocks.findIndex((i) => i.symbol === data.symbol);
      newListStocks[index].is_blacklist = !data.is_blacklist;
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

  const footer = () => {
    return (
      <div
        className="flex-default"
        style={{
          height: '50px',
        }}
      >
        <div>
          <Tooltip title="Testing">
            <Button
              size="small"
              type="primary"
              icon={<WarningOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerTesting(true)}
            />
          </Tooltip>

          <Tooltip title="Last updated check">
            <Button
              size="small"
              type="primary"
              icon={<FieldTimeOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => setOpenDrawerLastUpdated(true)}
            />
          </Tooltip>
        </div>
        <div className="flex" style={{ alignItems: 'center' }}>
          <RefreshButton onClick={() => handleGetData(dates)} />
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
          getRowClass={getRowClass}
          onResize={handleResize}
          onGridReady={handleGridReady}
          ref={gridRef}
        />
      </div>
      {footer()}
      {openDrawerTesting && (
        <StockTesting onClose={() => setOpenDrawerTesting(false)} />
      )}
      {openDrawerLastUpdated && (
        <StockLastUpdated onClose={() => setOpenDrawerLastUpdated(false)} />
      )}
    </div>
  );
};

export default StockManager;
