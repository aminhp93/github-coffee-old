import { Drawer, Button, notification, Table, DatePicker } from 'antd';
import {
  BACKTEST_COUNT,
  DATE_FORMAT,
  DEFAULT_DATE,
  getListAllSymbols,
} from '../constants';
import request from '@/services/request';
import { chunk } from 'lodash';
import StockService from '../service';
import moment from 'moment';
import { getMapBackTestData } from '../utils';

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

const Testing = ({
  onChange,
  onClose,
  open,
  listWatchlistObj,
  cbSetLoading,
  cbSetDataSource,
  fullDataSource,
  dataSource,
}: any) => {
  const [stockScheduleManager, setStockScheduleManager] = useState<any>([]);
  const [listJobs, setListJobs] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

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

  const getListStockJobs = async () => {
    try {
      const res = await StockService.getListStockJobs();
      setStockScheduleManager(res.data.stockScheduleManager);
      setListJobs(res.data.listJobs);
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const startDailyImportStockJob = async () => {
    try {
      StockService.startDailyImportStockJob();
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const cancelDailyImportStockJob = () => {
    try {
      StockService.cancelDailyImportStockJob();
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

  useEffect(() => {
    getListStockJobs();
  }, []);

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Testing</div>
          <div>
            <Button
              disabled={disabled}
              size="small"
              onClick={createBackTestData}
            >
              Create backtest
            </Button>
            <Button size="small" onClick={getBackTestData}>
              Backtest online
            </Button>
            <Button size="small" onClick={getListStockJobs}>
              Refresh
            </Button>
            <Button size="small" onClick={startDailyImportStockJob}>
              start_daily_import_stock_job
            </Button>
            <Button size="small" onClick={cancelDailyImportStockJob}>
              cancel_daily_import_stock_job
            </Button>
            <div>
              <Button size="small" onClick={forceDailyImportStockJob}>
                force_daily_import_stock_job
              </Button>
              <DatePicker onChange={onChangeDate} />
            </div>
          </div>
        </div>
      }
      placement="bottom"
      onClose={onClose}
      open={open}
    >
      <div className="height-100 flex">
        <div className="flex-1">
          {listJobs.map((i: any) => {
            return <div>{i}</div>;
          })}
        </div>
        <div className="flex-1">
          <Table
            size="small"
            dataSource={stockScheduleManager}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Testing;
