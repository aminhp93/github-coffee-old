import { Drawer, Button, notification, Table, DatePicker, Divider } from 'antd';
import {
  BACKTEST_COUNT,
  DATE_FORMAT,
  DEFAULT_DATE,
  getListAllSymbols,
} from '../constants';
import request from '@/services/request';
import { chunk, groupBy } from 'lodash';
import StockService from '../service';
import moment from 'moment';
import { getMapBackTestData } from '../utils';
import { CustomSymbol } from '../types';

import type { DatePickerProps } from 'antd';

import config from '@/config';
import { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const baseUrl = config.apiUrl;

const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
const endDate = DEFAULT_DATE.format(DATE_FORMAT);

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date',
    render: (data: any) => {
      return moment(data).format(DATE_FORMAT);
    },
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    render: (data: any) => {
      return data ? (
        <CheckCircleOutlined style={{ marginRight: '4px', color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      );
    },
  },
];

interface Props {
  dataSource: CustomSymbol[];
  fullDataSource: CustomSymbol[];
  open: boolean;
  cbSetLoading: (data: boolean) => void;
  cbSetDataSource: (data: CustomSymbol[]) => void;
  cbGetDataFromFireant: () => void;
  onClose: () => void;
}

const Testing = ({
  dataSource,
  fullDataSource,
  open,
  cbSetLoading,
  cbSetDataSource,
  cbGetDataFromFireant,
  onClose,
}: Props) => {
  const [listUpdateStatus, setListUpdateStatus] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getListPromise = async (data: any) => {
    const listPromise: any = [];
    data.forEach((i: any) => {
      listPromise.push(
        StockService.getHistoricalQuotes({
          symbol: i.symbol,
          startDate,
          endDate,
          offset: i.offset * 20,
          returnRequest: true,
        })
      );
    });

    return Promise.all(listPromise);
  };

  const createBackTestData = async () => {
    // Get data to backtest within 1 year from buy, sell symbol
    const listPromises: any = [];
    getListAllSymbols().forEach((j: any) => {
      for (let i = 0; i <= BACKTEST_COUNT; i++) {
        listPromises.push({
          symbol: j,
          offset: i,
        });
      }
    });

    const chunkedPromise = chunk(listPromises, 200);
    console.log(chunkedPromise);

    await request({
      url: `${baseUrl}/api/stocks/delete/`,
      method: 'POST',
    });

    for (let i = 0; i < chunkedPromise.length; i++) {
      // delay 2s
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await getListPromise(chunkedPromise[i]);
      const mappedRes = res
        .map((i: any) => i.data)
        .flat()
        .map((i: any) => {
          i.key = `${i.symbol}_${i.date}`;
          i.date = moment(i.date).format(DATE_FORMAT);
          return i;
        });
      // const res2 = await request({
      //   url: `${baseUrl}/api/stocks/delete/`,
      //   method: 'POST',
      // });
      const res2 = await request({
        url: `${baseUrl}/api/stocks/create/`,
        method: 'POST',
        data: mappedRes,
        // data: datafail,
      });
      console.log(i, chunkedPromise.length, mappedRes);

      if (res2?.status !== 200) {
        notification.error({ message: 'error' });
        // break for loop
        return;
      }
    }

    notification.success({ message: 'success' });
  };

  // disable if production env
  const disabled = process.env.NODE_ENV === 'production';
  const getBackTestData = () => {
    // Get data to backtest within 1 year from buy, sell symbol
    const listPromises: any = [];
    // const endDate = moment().add(0, 'days').format(DATE_FORMAT);
    dataSource
      .filter((i: any) => i.action === 'buy' || i.action === 'sell')
      .forEach((j: any) => {
        for (let i = 1; i <= BACKTEST_COUNT; i++) {
          listPromises.push(
            StockService.getHistoricalQuotes({
              symbol: j.symbol,
              startDate,
              endDate,
              offset: i * 20,
            })
          );
        }
      });
    cbSetLoading && cbSetLoading(true);

    Promise.all(listPromises)
      .then((res: any) => {
        cbSetLoading && cbSetLoading(false);
        const flattenData = res.flat();
        console.log(flattenData);
        const newDataSource: any = getMapBackTestData(
          flattenData,
          dataSource,
          fullDataSource
        );
        cbSetDataSource && cbSetDataSource(newDataSource);
      })
      .catch((e) => {
        cbSetLoading && cbSetLoading(false);
      });
  };

  const getLastUpdated = async () => {
    try {
      const res: any = await StockService.getLastUpdated();
      if (res.data && res.data.length && res.data.length === 1) {
        setLastUpdated(res.data[0].last_updated);
      }
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const forceDailyImportStockJob = () => {
    try {
      const requestData: any = {};
      if (selectedDate) {
        requestData['date'] = selectedDate.format(DATE_FORMAT);
      }
      StockService.forceDailyImportStockJob(requestData);
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
  };

  const updateData = async () => {
    if (selectedDate) {
      // if have selected date, update only selected date and no udpate selected date
      updateDataWithDate(
        selectedDate.format(DATE_FORMAT),
        selectedDate.format(DATE_FORMAT),
        0
      );
    } else {
      // if no selected date, update from last updated date to today, update selected date
      let nextCall = true;
      let offset = 0;
      while (nextCall) {
        const res = await updateDataWithDate(
          moment(lastUpdated).add(1, 'days').format(DATE_FORMAT),
          moment().format(DATE_FORMAT),
          offset
        );
        offset += 20;
        if (res && res.length && res[0].length < 20) {
          nextCall = false;
        }
      }
      try {
        const res = await StockService.updateLastUpdated({
          column: 'last_updated',
          value: endDate,
        });
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const updateDataWithDate = async (
    startDate: string,
    endDate: string,
    offset: number
  ) => {
    // get data
    const listPromises: any = [];
    getListAllSymbols().forEach((symbol: string) => {
      listPromises.push(
        StockService.getHistoricalQuotes({
          symbol,
          startDate,
          endDate,
          offset,
        })
      );
    });

    const resListPromises = await Promise.all(listPromises);
    if (resListPromises) {
      let listPromiseUpdate: any = [];
      const flattenData = resListPromises.flat();
      const objData: any = groupBy(flattenData, 'date');
      console.log('objData', objData);
      for (const key in objData) {
        if (Object.prototype.hasOwnProperty.call(objData, key)) {
          const element = objData[key];
          objData[key] = element.map((i: any) => {
            i.key = `${i.symbol}_${i.date}`;
            i.date = moment(i.date).format(DATE_FORMAT);
            return i;
          });
          console.log(261, key);
          listPromiseUpdate.push(
            deleteAndInsertStockData(moment(key).format(DATE_FORMAT), element)
          );
        }
      }
      const res2 = await Promise.all(listPromiseUpdate);
      console.log(res2);
      setListUpdateStatus(res2);
    }
    return resListPromises;
  };

  const deleteAndInsertStockData = (date: string, data: any) => {
    console.log(date, data);
    // return a promise

    return new Promise(async (resolve, reject) => {
      try {
        console.log('deleteAndInsertStockData', date);
        // Delete all old data with selected date
        await StockService.deleteStockData({
          column: 'date',
          value: date,
        });

        // Insert new data with selected date
        await StockService.insertStockData(data);
        resolve({ status: 'success', date });
      } catch (e) {
        console.log(e);
        reject({ status: 'error', date });
      }
    });
  };

  useEffect(() => {
    getLastUpdated();
  }, []);

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Testing</div>
          <div>Last updated: {lastUpdated}</div>
        </div>
      }
      placement="bottom"
      onClose={onClose}
      open={open}
    >
      <div className="height-100 flex">
        <div className="flex-1">
          <Button disabled={disabled} size="small" onClick={createBackTestData}>
            Create backtest
          </Button>
          <Divider />
          <Button size="small" onClick={getBackTestData}>
            Backtest online
          </Button>
          <Divider />
          <Button size="small" onClick={cbGetDataFromFireant}>
            handleGetDataFromFireant
          </Button>
          <Divider />
          <div>
            <Button size="small" onClick={forceDailyImportStockJob}>
              force_daily_import_stock_job
            </Button>{' '}
            <Button size="small" onClick={updateData}>
              Update data
            </Button>
            <DatePicker onChange={onChangeDate} />
          </div>
        </div>
        <div className="flex-1">
          <Table
            size="small"
            dataSource={listUpdateStatus}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
