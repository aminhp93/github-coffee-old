import BackTestChart from './BackTestChart';
import moment from 'moment';
import { DATE_FORMAT, LIST_ALL_SYMBOLS } from '../constants';
import {
  mapDataChart,
  evaluateStockBase,
  getStockDataFromSupabase,
  getListMarkLines,
} from '../utils';
import StockService from '../service';
import { useEffect, useState } from 'react';
import { SupabaseData, StockData } from '../types';
import {
  DatePicker,
  InputNumber,
  notification,
  Button,
  Select,
  Divider,
} from 'antd';

const list_base_fields = [
  {
    key: 'support_base',
    label: 'Support base',
  },
  {
    key: 'target_base',
    label: 'Target base',
  },
];

const { RangePicker } = DatePicker;

interface Props {
  symbol: string;
  dates: any;
}

const StockDetailChart = ({ symbol: defaultSymbol, dates }: Props) => {
  const [dataChart, setDataChart] = useState<any>(null);
  const [stockBase, setStockBase] = useState<any>({});
  const [symbol, setSymbol] = useState<string>(defaultSymbol);
  const [stockData, setStockData] = useState<StockData | null>(null);

  const handleChangeStockBase = (key: any, data: any) => {
    setStockBase({
      ...stockBase,
      [key]: {
        ...stockBase[key],
        ...data,
      },
    });
  };

  const updateStockBase = async () => {
    try {
      const data = {
        symbol,
        ...stockBase,
      };
      if (stockBase && stockBase.id) {
        await StockService.updateStockBase(data);
      } else {
        await StockService.insertStockBase([data]);
      }
      notification.success({ message: 'success' });
    } catch (error) {
      console.log('error', error);
      notification.error({ message: 'error' });
    }
  };

  const getData = async (symbol: string) => {
    try {
      if (!dates || dates.length !== 2) return;
      const resStockBase = await StockService.getStockBase(symbol);
      let newStockBase = {};
      if (resStockBase.data && resStockBase.data.length === 1) {
        newStockBase = resStockBase.data[0];
      }

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);
      // get data

      // use latest data
      // For now only can use data from fireant
      let resFireant;
      if (
        dates[1].format(DATE_FORMAT) === moment().format(DATE_FORMAT) &&
        moment().hour() < 15
      ) {
        const res = await StockService.getStockDataFromFireant({
          startDate: moment().format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
          listSymbols: [symbol],
        });
        resFireant = res.map((i) => {
          const item = i.data[0];
          const {
            date,
            dealVolume,
            priceClose,
            priceHigh,
            priceLow,
            priceOpen,
            symbol,
            totalValue,
            totalVolume,
          } = item;
          return {
            date: moment(date).format(DATE_FORMAT),
            dealVolume,
            priceClose,
            priceHigh,
            priceLow,
            priceOpen,
            symbol,
            totalValue,
            totalVolume,
          };
        });
      }

      // use old static data from supabase (updated 1 day ago)

      const res = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
        listSymbols: [symbol],
      });
      console.log('res', res);

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }
      console.log('source', source);

      const mappedData = getStockDataFromSupabase(source as SupabaseData[]);
      console.log('mappedData', mappedData);
      if (mappedData && mappedData.length === 1 && mappedData[0].fullData) {
        const newStockData = mappedData[0];
        setStockData(newStockData);
        setDataChart(
          mapDataChart({
            fullData: newStockData.fullData,
            listMarkLines: getListMarkLines(newStockBase),
          })
        );
      }

      setStockBase(newStockBase);
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  useEffect(() => {
    if (!stockData) return;
    setDataChart(
      mapDataChart({
        fullData: stockData.fullData,
        listMarkLines: getListMarkLines(stockBase),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockBase]);

  useEffect(() => {
    getData(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    setSymbol(defaultSymbol);
  }, [defaultSymbol]);

  console.log('stockBase', stockBase);

  const { risk, target, big_sell } = evaluateStockBase(
    stockBase,
    stockData?.fullData
  );

  return (
    <div
      className="StockDetailChart flex height-100 width-100"
      style={{ flexDirection: 'column' }}
    >
      <div
        className="flex"
        style={{ height: '200px', flexDirection: 'column' }}
      >
        <div>
          <Select
            showSearch
            size="small"
            value={symbol}
            style={{ width: 120 }}
            onChange={(value: string) => {
              setSymbol(value);
              getData(value);
            }}
            options={LIST_ALL_SYMBOLS.map((i) => {
              return { value: i, label: i };
            })}
          />
          <Button size="small" onClick={updateStockBase}>
            Update
          </Button>
        </div>

        <div className="flex flex-1" style={{ overflow: 'auto' }}>
          {list_base_fields.map((i) => (
            <div key={i.key}>
              {i.label}
              <div style={{ marginTop: '10px' }}>
                <InputNumber
                  step={0.1}
                  size="small"
                  addonBefore="base_min"
                  value={stockBase?.[i.key]?.base_min}
                  onChange={(value: any) => {
                    handleChangeStockBase(i.key, {
                      base_min: value,
                    });
                  }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <InputNumber
                  step={0.1}
                  size="small"
                  addonBefore="base_max"
                  value={stockBase?.[i.key]?.base_max}
                  onChange={(value: any) => {
                    handleChangeStockBase(i.key, {
                      base_max: value,
                    });
                  }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <RangePicker
                  size="small"
                  onChange={(dates) => {
                    handleChangeStockBase(i.key, {
                      startBaseDate:
                        dates && dates[0] && dates[0].format(DATE_FORMAT),
                      endBaseDate:
                        dates && dates[1] && dates[1].format(DATE_FORMAT),
                    });
                  }}
                  value={
                    stockBase && stockBase[i.key]
                      ? [
                          moment(stockBase[i.key].startBaseDate),
                          moment(stockBase[i.key].endBaseDate),
                        ]
                      : null
                  }
                  format={DATE_FORMAT}
                />
              </div>
            </div>
          ))}
          <div
            className="flex"
            style={{ marginLeft: '20px', flexDirection: 'column' }}
          >
            <div>Risk: {risk && risk.toFixed(0) + '%'}</div>
            <div>target: {target && target.toFixed(0) + '%'}</div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <div>Big sell</div>
              <div>
                {big_sell &&
                  big_sell.map((j) => {
                    return (
                      <div key={j.date}>
                        {j.date} - {`${j.overAverage.toFixed(0)}%`}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div style={{ flex: 1 }}>
        {dataChart && <BackTestChart data={dataChart} />}{' '}
      </div>
    </div>
  );
};

export default StockDetailChart;
