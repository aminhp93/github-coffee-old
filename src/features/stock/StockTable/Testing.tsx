import { Drawer, Button, notification } from 'antd';
import { BACKTEST_COUNT, DATE_FORMAT } from '../constants';
import request from 'libs/request';
import { chunk } from 'lodash';
import StockService from '../service';
import moment from 'moment';

import config from 'libs/config';

const baseUrl = config.apiUrl;

const Testing = ({ onChange, onClose, open, listWatchlistObj }: any) => {
  const getListPromise = async (data: any) => {
    const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
    // const endDate = moment().add(0, 'days').format(DATE_FORMAT);
    const endDate = '2022-12-25';
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
    const thanh_khoan_vua_wl: any =
      listWatchlistObj && listWatchlistObj[737544];

    // Get data to backtest within 1 year from buy, sell symbol
    const listPromises: any = [];
    thanh_khoan_vua_wl.symbols.forEach((j: any) => {
      for (let i = 1; i <= BACKTEST_COUNT; i++) {
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

  return (
    <Drawer title="Settings" placement="bottom" onClose={onClose} open={open}>
      <div
        className="height-100"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Button disabled={disabled} size="small" onClick={createBackTestData}>
          Create backtest
        </Button>
      </div>
    </Drawer>
  );
};

export default Testing;
