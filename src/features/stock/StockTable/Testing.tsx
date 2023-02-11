import { useState, useEffect } from 'react';
import { Drawer, Select, Button, DatePicker, notification } from 'antd';
import StockService from '../service';
import { DATE_FORMAT, LIST_ALL_SYMBOLS } from '../constants';
import moment from 'moment';
import { updateDataWithDate, createBackTestData } from '../utils';

const { RangePicker } = DatePicker;

interface Props {
  onClose: () => void;
}

const TestSupabaseData = ({ onClose }: Props) => {
  const [dates, setDates] = useState<any>([moment(), moment()]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

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

  const handleTest = async (symbol: string) => {
    if (dates.length !== 2) return;
    const startDate = dates[0].format(DATE_FORMAT);
    const endDate = dates[1].format(DATE_FORMAT);
    const res = await StockService.getHistoricalQuotes({
      symbol,
      startDate,
      endDate,
    });
    const res2 = await StockService.getStockDataFromSupabase({
      listSymbols: [symbol],
      startDate,
      endDate,
    });
    if (res && res2.data && res.length === 1 && res2.data.length === 1) {
      const data = res[0];
      const data2 = res2.data[0];
      if (
        data.dealVolume === data2.dealVolume &&
        data.priceClose === data2.priceClose &&
        data.priceHigh === data2.priceHigh &&
        data.priceLow === data2.priceLow &&
        data.priceOpen === data2.priceOpen &&
        data.totalValue === data2.totalValue &&
        data.totalVolume === data2.totalVolume
      ) {
        console.log('OK');
      } else {
        console.log('NOT OK');
      }
    }
  };

  const handleTestAll = () => {
    LIST_ALL_SYMBOLS.forEach((symbol) => {
      handleTest(symbol);
    });
  };

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const updateData = async () => {
    try {
      const selectedDate = dates.length === 2 ? dates[1] : null;
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

        await StockService.updateLastUpdated({
          column: 'last_updated',
          value: moment().format(DATE_FORMAT),
        });
      }
      notification.success({ message: 'success' });
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const handleTest2 = async () => {
    // const startDate = DEFAULT_START_DATE.format(DATE_FORMAT);
    // const endDate = DEFAULT_END_DATE.format(DATE_FORMAT);
    // const supabaseData = await getDataFromSupabase({ startDate, endDate });
    // const fireantData = await getDataFromFireant({ startDate, endDate });
    // const newDataSupabase = getDataSource(supabaseData, DEFAULT_FILTER);
    // const newDataFireant = getDataSource(fireantData, DEFAULT_FILTER);
    // const supabaseDataBacktest = await getBackTestDataOffline({
    //   database: 'supabase',
    //   dataSource: newDataSupabase,
    //   fullDataSource: supabaseData,
    // });
    // const fireantDataBacktest = await getBackTestDataOffline({
    //   database: 'supabase',
    //   dataSource: newDataFireant,
    //   fullDataSource: fireantData,
    // });
    // setDataFromSupabase(supabaseDataBacktest);
    // setDataFromFireant(fireantDataBacktest);
  };

  useEffect(() => {
    getLastUpdated();
  }, []);

  return (
    <Drawer
      title={
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <div>Testing</div>
          <RangePicker
            size="small"
            onChange={handleChangeDate}
            defaultValue={dates}
            format={DATE_FORMAT}
          />
        </div>
      }
      placement="bottom"
      onClose={onClose}
      open={true}
    >
      <div
        className="height-100"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div>
          Last updated: {lastUpdated}
          <Button size="small" onClick={updateData}>
            Update data
          </Button>
        </div>
        <div>
          <Button
            disabled
            size="small"
            onClick={createBackTestData}
            style={{ marginTop: '20px' }}
          >
            Create backtest
          </Button>
          <Button
            size="small"
            onClick={handleTest2}
            style={{ marginTop: '20px' }}
          >
            Test data from fireant vs supabase
          </Button>
          <Select
            size="small"
            defaultValue="VPB"
            style={{ width: 120 }}
            onChange={(value: string) => {
              handleTest(value);
            }}
            options={LIST_ALL_SYMBOLS.map((i) => {
              return { value: i, label: i };
            })}
          />
          <Button size="small" onClick={() => handleTest('VPB')}>
            Test VPB
          </Button>
          <Button size="small" onClick={() => handleTestAll()}>
            Test All
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default TestSupabaseData;
