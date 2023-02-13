import {
  Button,
  DatePicker,
  Divider,
  InputNumber,
  notification,
  Select,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DATE_FORMAT, LIST_ALL_SYMBOLS } from '../constants';
import StockService from '../service';
import { StockData, SupabaseData } from '../types';
import {
  evaluateStockBase,
  getListMarkLines,
  getStockDataFromSupabase,
  mapDataChart,
} from '../utils';
import BackTestChart from './BackTestChart';

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
  const [stockData, setStockData] = useState<StockData | undefined>(undefined);

  const handleChangeStockBase = (key: any, data: any) => {
    const newStockBase = {
      ...stockBase,
      [key]: {
        ...stockBase[key],
        ...data,
      },
    };
    setDataChart(
      mapDataChart({
        fullData: stockData?.fullData,
        listMarkLines: getListMarkLines(newStockBase, stockData),
      })
    );
    setStockBase(newStockBase);
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
    } catch (e) {
      console.log(e);
      notification.error({ message: 'error' });
    }
  };

  const getData = async (symbol: string) => {
    try {
      if (!dates || dates.length !== 2) return;
      const resStockBase = await StockService.getStockBase(symbol);
      let newStockBase: any = {};
      if (resStockBase.data && resStockBase.data.length === 1) {
        newStockBase = resStockBase.data[0];
      }

      const startDate = dates[0].format(DATE_FORMAT);
      const endDate = dates[1].format(DATE_FORMAT);

      let resFireant;
      if (
        dates[1].format(DATE_FORMAT) === moment().format(DATE_FORMAT) &&
        moment().hour() < 15 &&
        !localStorage.getItem('turnOffFetchTodayData')
      ) {
        const res = await StockService.getStockDataFromFireant({
          startDate: moment().format(DATE_FORMAT),
          endDate: moment().format(DATE_FORMAT),
          listSymbols: [symbol],
        });
        resFireant = res.map((i) => {
          const item = i.data && i.data[0];

          if (item) {
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
          }
          return null;
        });
        resFireant = resFireant.filter((i) => i);
      }

      const res = await StockService.getStockDataFromSupabase({
        startDate,
        endDate,
        listSymbols: [symbol],
      });

      let source: any = res.data;
      if (resFireant) {
        source = [...resFireant, ...source];
      }

      const mappedData = getStockDataFromSupabase(source as SupabaseData[]);
      if (mappedData && mappedData.length === 1 && mappedData[0].fullData) {
        const newStockData = mappedData[0];
        setStockData(newStockData);
        setDataChart(
          mapDataChart({
            fullData: newStockData.fullData,
            listMarkLines: getListMarkLines(newStockBase, newStockData),
          })
        );
      }
      setSymbol(symbol);
      setStockBase(newStockBase);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData(defaultSymbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSymbol]);

  console.log(
    'stockBase',
    stockBase,
    'stockData',
    stockData,
    'dataChart',
    dataChart
  );

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
        {dataChart && <BackTestChart data={dataChart} />}
      </div>
    </div>
  );
};

export default StockDetailChart;
