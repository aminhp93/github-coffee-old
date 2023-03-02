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
import { DATE_FORMAT } from './constants';
import StockService from './service';
import { StockData, SupabaseData } from './types';
import {
  evaluateStockBase,
  getListMarkLines,
  getStockDataFromSupabase,
  mapDataChart,
  getTodayData,
  getMinTotalValue,
  mapDataFromStockBase,
  getListMarkPoints,
} from './utils';
import StockChart from './stockChart/StockChart';
import { updateSelectedSymbol, selectSelectedSymbol } from './stockSlice';
import { useSelector, useDispatch } from 'react-redux';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import RefreshButton from './StockTable/RefreshButton';
import BuyPoint from './StockTable/BuyPoint';

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
  const [listAllSymbols, setListAllSymbols] = useState<string[]>([]);
  const [selectedVolumeField, setSelectedVolumeField] = useState<
    'dealVolume' | 'totalVolume'
  >('dealVolume');

  const handleChangeDate = (dates: any) => {
    setDates(dates);
  };

  const handleChangeStockBase = (id: any, data: any) => {
    const new_list_base =
      stockBase && stockBase.list_base
        ? stockBase.list_base.map((item: any) => {
            return {
              id: item.id,
              value: id === item.id ? data : item.value,
              startDate: item.startDate,
              endDate: item.endDate,
            };
          })
        : [1, 2, 3].map((item) => {
            return {
              id: item,
              value: id === item ? data : 0,
              startDate: null,
              endDate: null,
            };
          });
    const newStockBase = {
      ...stockBase,
      symbol: selectedSymbol,
      list_base: new_list_base,
    };

    setDataChart(
      mapDataChart({
        volumeField: selectedVolumeField,
        fullData: stockData?.fullData,
        listMarkPoints: getListMarkPoints(newStockBase, stockData),
        listMarkLines: getListMarkLines(newStockBase, stockData),
      })
    );
    setStockBase(newStockBase);
  };

  const updateStockBase = async () => {
    try {
      if (stockBase && stockBase.id) {
        await StockService.updateStockBase(stockBase);
      } else {
        await StockService.insertStockBase([stockBase]);
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
        <div className="flex" style={{ alignItems: 'center' }}>
          <RefreshButton onClick={() => getData(selectedSymbol, dates)} />
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

  const getData = async (
    symbol: string,
    dates: [moment.Moment, moment.Moment] | undefined,
    volumeField: 'dealVolume' | 'totalVolume' = 'dealVolume'
  ) => {
    try {
      if (!dates || dates.length !== 2 || !symbol) return;
      const resStockBase = await StockService.getStockBase(symbol);

      let resFireant = await getTodayData(dates, [symbol]);
      const res = await StockService.getStockDataFromSupabase({
        startDate: dates[0].format(DATE_FORMAT),
        endDate: dates[1].format(DATE_FORMAT),
        listSymbols: [symbol],
      });

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
            volumeField,
            fullData: newStockData.fullData,
            listMarkLines: getListMarkLines(newStockBase, newStockData),
            listMarkPoints: getListMarkPoints(newStockBase, newStockData),
          })
        );
      }
      setStockBase(newStockBase);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCbBuyPoint = (data: moment.Moment | undefined) => {
    const newStockBase = {
      ...stockBase,
      symbol: selectedSymbol,
      buy_point: data
        ? {
            date: data.format(DATE_FORMAT),
          }
        : null,
    };
    setStockBase(newStockBase);
  };

  useEffect(() => {
    getData(selectedSymbol, dates, selectedVolumeField);
  }, [selectedSymbol, dates, selectedVolumeField]);

  useEffect(() => {
    const init = async () => {
      const resStockBase = await StockService.getAllStockBase();

      const { list_all } = mapDataFromStockBase(resStockBase.data || []);
      setListAllSymbols(list_all);
    };
    init();
  }, []);

  console.log(
    'StockDetail',
    'stockBase',
    stockBase,
    'stockData',
    stockData,
    'dataChart',
    dataChart
  );

  const { risk_b1, risk_b2, target } = evaluateStockBase(
    stockBase,
    stockData?.fullData
  );
  const { minTotal, maxTotal, averageTotal } = getMinTotalValue(stockData);

  return (
    <div
      className="StockDetailChart flex height-100 width-100"
      style={{ flexDirection: 'column' }}
    >
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div>
          <Select
            showSearch
            size="small"
            value={selectedSymbol}
            style={{ width: 120 }}
            onChange={(value: string) => {
              dispatch(updateSelectedSymbol(value));
              getData(value, dates);
            }}
            options={listAllSymbols.map((i) => {
              return { value: i, label: i };
            })}
          />
        </div>
        <div className="flex">
          <div style={{ marginLeft: '10px' }}>
            target: {target && target.toFixed(0) + '%'}
          </div>
          <div style={{ marginLeft: '10px' }}>
            risk_b2: {risk_b2 && risk_b2.toFixed(0) + '%'}
          </div>
          <div style={{ marginLeft: '10px' }}>
            risk_b1: {risk_b1 && risk_b1.toFixed(0) + '%'}
          </div>
        </div>
        <Button
          size="small"
          icon={showDetail ? <DownOutlined /> : <UpOutlined />}
          onClick={() => setShowDetail(showDetail ? false : true)}
        />
      </div>

      {showDetail ? (
        <div
          className="flex"
          style={{ height: '200px', flexDirection: 'column' }}
        >
          <div
            className="flex flex-1"
            style={{
              overflow: 'auto',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div>
              <div style={{ marginRight: '10px' }}>
                {[1, 2, 3].map((i: any, index: number) => (
                  <InputNumber
                    key={i.key}
                    step={0.1}
                    size="small"
                    addonBefore={`b_${index + 1}`}
                    value={
                      stockBase.list_base ? stockBase.list_base[index].value : 0
                    }
                    style={{ marginBottom: '10px', marginRight: '4px' }}
                    onChange={(value: any) => {
                      handleChangeStockBase(index + 1, value);
                    }}
                  />
                ))}
                <div style={{ marginBottom: '10px' }}>
                  <BuyPoint
                    buyPoint={stockBase?.buy_point}
                    onCb={handleCbBuyPoint}
                  />
                </div>
                <Button size="small" onClick={updateStockBase}>
                  Update
                </Button>
              </div>
            </div>
            <div>
              Min total in 30 days: {minTotal} - {maxTotal} - {averageTotal}
              <div>
                <Select
                  size="small"
                  value={selectedVolumeField}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    setSelectedVolumeField(value);
                  }}
                  options={['dealVolume', 'totalVolume'].map((i) => {
                    return { value: i, label: i };
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Divider />
      <div style={{ flex: 1 }}>
        {dataChart && <StockChart data={dataChart} />}
      </div>
      {footer()}
    </div>
  );
};

export default StockDetailChart;
