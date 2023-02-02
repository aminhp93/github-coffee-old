import { useState } from 'react';
import { Drawer, Select, Button, DatePicker } from 'antd';
import StockService from '../service';
import { DATE_FORMAT, LIST_ALL_SYMBOLS } from '../constants';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface Props {
  onClose: () => void;
}

const TestSupabaseData = ({ onClose }: Props) => {
  const [dates, setDates] = useState<any>([moment(), moment()]);

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
    console.log(res, res2);
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

  console.log('dates', dates);

  return (
    <Drawer
      title="TestSupabaseData"
      placement="bottom"
      onClose={onClose}
      open={true}
    >
      <div
        className="height-100"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Select
          defaultValue="VPB"
          style={{ width: 120 }}
          onChange={(value: string) => {
            handleTest(value);
          }}
          options={LIST_ALL_SYMBOLS.map((i) => {
            return { value: i, label: i };
          })}
        />
        <Button onClick={() => handleTest('VPB')}>Test VPB</Button>
        <Button onClick={() => handleTestAll()}>Test All</Button>
        <RangePicker
          size="small"
          onChange={handleChangeDate}
          defaultValue={dates}
          format={DATE_FORMAT}
        />
      </div>
    </Drawer>
  );
};

export default TestSupabaseData;
