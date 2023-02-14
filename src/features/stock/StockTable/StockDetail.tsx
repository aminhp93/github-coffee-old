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
  getTodayData,
} from '../utils';
import BackTestChart from './BackTestChart';
import { updateSelectedSymbol, selectSelectedSymbol } from '../stockSlice';
import { useSelector, useDispatch } from 'react-redux';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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

const StockDetailChart = () => {
  // get store from redux
  const selectedSymbol = useSelector(selectSelectedSymbol);
  const dispatch = useDispatch();

  const [dataChart, setDataChart] = useState<any>(null);
  const [stockBase, setStockBase] = useState<any>({});
  const [stockData, setStockData] = useState<StockData | undefined>(undefined);
  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [dates, setDates] = useState<
    [moment.Moment, moment.Moment] | undefined
  >([moment().add(-1, 'years'), moment()]);

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

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
        symbol: selectedSymbol,
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

  const footer = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: 'flex-end',
          height: '50px',
          alignItems: 'center',
        }}
      >
        <RangePicker
          style={{ marginLeft: 8 }}
          size="small"
          onChange={handleChangeDate}
          value={dates}
          format={DATE_FORMAT}
        />
      </div>
    );
  };

  useEffect(() => {
    const getData = async (
      symbol: string,
      dates: [moment.Moment, moment.Moment] | undefined
    ) => {
      try {
        if (!dates || dates.length !== 2 || !symbol) return;

        let resFireant = await getTodayData(dates);

        const res = await StockService.getStockDataFromSupabase({
          startDate: dates[0].format(DATE_FORMAT),
          endDate: dates[1].format(DATE_FORMAT),
          listSymbols: [symbol],
        });

        const resStockBase = await StockService.getStockBase(symbol);

        let newStockBase: any = {};
        if (resStockBase.data && resStockBase.data.length === 1) {
          newStockBase = resStockBase.data[0];
        }
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
        setStockBase(newStockBase);
      } catch (e) {
        console.log(e);
      }
    };
    getData(selectedSymbol, dates);
  }, [selectedSymbol, dates]);

  console.log(
    'StockDetail',
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
      <Button
        size="small"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        icon={showDetail ? <DownOutlined /> : <UpOutlined />}
        onClick={() => setShowDetail(showDetail ? false : true)}
      />
      <Select
        showSearch
        size="small"
        value={selectedSymbol}
        style={{ width: 120 }}
        onChange={(value: string) => {
          dispatch(updateSelectedSymbol(value));
        }}
        options={LIST_ALL_SYMBOLS.map((i) => {
          return { value: i, label: i };
        })}
      />

      {showDetail ? (
        <div
          className="flex"
          style={{ height: '200px', flexDirection: 'column' }}
        >
          <div className="flex flex-1" style={{ overflow: 'auto' }}>
            {list_base_fields.map((i) => (
              <div key={i.key}>
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
            <Button size="small" onClick={updateStockBase}>
              Update
            </Button>
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
      ) : null}
      <Divider />
      <div style={{ flex: 1 }}>
        {dataChart && <BackTestChart data={dataChart} />}
      </div>
      {footer()}
    </div>
  );
};

export default StockDetailChart;
