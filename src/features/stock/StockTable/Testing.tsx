import { Drawer, Button, notification, Table, DatePicker, Divider } from 'antd';
import {
  BACKTEST_COUNT,
  DATE_FORMAT,
  DEFAULT_DATE,
  getListAllSymbols,
  DEFAULT_FILTER,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
} from '../constants';
import request from '@/services/request';
import { chunk, groupBy } from 'lodash';
import StockService from '../service';
import moment from 'moment';
import {
  getDataFromSupabase,
  getDataFromFireant,
  getBackTestDataOffline,
  getDataSource,
} from '../utils';

import type { DatePickerProps } from 'antd';

import config from '@/config';
import { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const baseUrl = config.apiUrl;

const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
const endDate = DEFAULT_DATE.format(DATE_FORMAT);

const UPDATE_STATUS_COLUMNS = [
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
  open: boolean;
  onClose: () => void;
}

const Testing = ({ open, onClose }: Props) => {
  const [listUpdateStatus, setListUpdateStatus] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataFromSupabase, setDataFromSupabase] = useState<any>([]);
  const [dataFromFireant, setDataFromFireant] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);

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
      setColumns(UPDATE_STATUS_COLUMNS);
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

  const handleTest = async () => {
    const startDate = DEFAULT_START_DATE.format(DATE_FORMAT);
    const endDate = DEFAULT_END_DATE.format(DATE_FORMAT);
    const supabaseData = await getDataFromSupabase({ startDate, endDate });
    const fireantData = await getDataFromFireant({ startDate, endDate });

    const newDataSupabase = getDataSource(supabaseData, DEFAULT_FILTER);
    const newDataFireant = getDataSource(fireantData, DEFAULT_FILTER);

    const supabaseDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataSupabase,
      fullDataSource: supabaseData,
    });
    const fireantDataBacktest = await getBackTestDataOffline({
      database: 'supabase',
      dataSource: newDataFireant,
      fullDataSource: fireantData,
    });
    console.log(supabaseDataBacktest, fireantDataBacktest);
    setDataFromSupabase(supabaseDataBacktest);
    setDataFromFireant(fireantDataBacktest);
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
          <div>
            <Button size="small" onClick={updateData}>
              Update data
            </Button>
            <DatePicker size="small" onChange={onChangeDate} />
          </div>
          <Divider />
          <Button
            disabled
            size="small"
            onClick={createBackTestData}
            style={{ marginTop: '20px' }}
          >
            Create backtest
          </Button>

          <Divider />
          <Button
            size="small"
            onClick={handleTest}
            style={{ marginTop: '20px' }}
          >
            Test data from fireant vs supabase
          </Button>

          <Divider />
        </div>
        <div className="flex-1">
          {listUpdateStatus && listUpdateStatus.length && (
            <Table
              size="small"
              dataSource={listUpdateStatus}
              columns={columns}
              pagination={false}
            />
          )}
          <div>
            <div>Supabase</div>
            <div>{dataFromSupabase.dataSource?.length}</div>
            <div>{dataFromSupabase.fullDataSource?.length}</div>
            <div>Fireant</div>
            <div>{dataFromFireant.dataSource?.length}</div>
            <div>{dataFromFireant.fullDataSource?.length}</div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
