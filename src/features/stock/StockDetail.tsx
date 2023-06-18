// Import library
import type { EChartsOption } from 'echarts';
import {
  CheckCircleOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  InputNumber,
  notification,
  Select,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { debounce, get } from 'lodash';

// Import components
import { DATE_FORMAT } from './constants';
import StockService from './service';
import StockChart from './stockChart/StockChart';
import BuyPoint from './stockTable/BuyPoint';
import RefreshButton from './stockTable/RefreshButton';
import {
  StockData,
  SupabaseData,
  StockChartData,
  StockBase,
} from './Stock.types';
import {
  evaluateStockBase,
  getListMarkLines,
  getListMarkPoints,
  getMinTotalValue,
  getStockDataFromSupabase,
  getTodayData,
  mapDataChart,
  mapDataFromStockBase,
  analyse,
} from './utils';
import { dataZoom } from 'features/stock/stockChart/StockChart.constants';
import useStockStore from './Stock.store';

const { RangePicker } = DatePicker;

const StockDetail = () => {
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);

  const [loading, setLoading] = useState<boolean>(false);
  const [dataChart, setDataChart] = useState<StockChartData | undefined>();
  const [stockBase, setStockBase] = useState<StockBase | undefined>(undefined);
  const [stockData, setStockData] = useState<StockData | undefined>();
  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>([
    dayjs().add(-18, 'months'),
    dayjs(),
  ]);
  const [listAllSymbols, setListAllSymbols] = useState<string[]>([]);
  const [selectedVolumeField, setSelectedVolumeField] = useState<
    'dealVolume' | 'totalVolume'
  >('totalVolume');

  const handleChangeDate = (data: null | (dayjs.Dayjs | null)[]) => {
    if (!data || !data[0] || !data[1]) return;
    setDates(data as [dayjs.Dayjs, dayjs.Dayjs]);
  };

  const handleChangeStockBase = (id: number, data: number) => {
    const new_list_base = stockBase?.list_base
      ? stockBase.list_base.map((item) => {
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
    setStockBase(newStockBase as StockBase);
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
    dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined,
    volumeField: 'dealVolume' | 'totalVolume' = 'dealVolume'
  ) => {
    try {
      if (!dates || dates.length !== 2 || !symbol) return;
      setLoading(true);
      const listPromise: any = [
        StockService.getStockBase(symbol),
        getTodayData(dates, [symbol]),
        StockService.getStockDataFromSupabase({
          startDate: dates[0].format(DATE_FORMAT),
          endDate: dates[1].format(DATE_FORMAT),
          listSymbols: [symbol],
        }),
      ];

      const [resStockBase, resFireant, res] = await Promise.all(listPromise);

      setLoading(false);

      let newStockBase = {};
      if (resStockBase.data && resStockBase.data.length === 1) {
        newStockBase = resStockBase.data[0];
      }
      let source = res.data;
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
      setStockBase(newStockBase as StockBase);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleCbBuyPoint = (data: dayjs.Dayjs | undefined) => {
    const newStockBase = {
      ...stockBase,
      symbol: selectedSymbol,
      buy_point: data
        ? {
            date: data.format(DATE_FORMAT),
          }
        : null,
    };
    setStockBase(newStockBase as StockBase);
  };

  useEffect(() => {
    if (!stockBase?.symbol) return;
    (async () => {
      try {
        if (stockBase?.id) {
          await StockService.updateStockBase(stockBase);
        } else {
          await StockService.insertStockBase([stockBase]);
        }
        notification.success({ message: 'success' });
      } catch (e) {
        notification.error({ message: 'error' });
      }
    })();
  }, [stockBase]);

  useEffect(() => {
    getData(selectedSymbol, dates, selectedVolumeField);
  }, [selectedSymbol, dates, selectedVolumeField]);

  useEffect(() => {
    (async () => {
      const resStockBase = await StockService.getAllStockBase();

      const { list_all } = mapDataFromStockBase(
        resStockBase.data as StockBase[]
      );
      setListAllSymbols(list_all);
    })();
  }, []);

  const { risk_b1, risk_b2, target } = evaluateStockBase(
    stockBase,
    stockData?.fullData
  );
  const { minTotal, maxTotal, averageTotal } = getMinTotalValue(stockData);

  const { listBigSell, countEstimate } = analyse(stockData, stockBase);

  console.log('dataChart', { dataChart, stockData, stockBase });

  const debounceZoom = useMemo(
    () =>
      debounce(async (params: any, oldOption: EChartsOption) => {
        // Zoom using toolbox and call api with smaller resolution
        console.log(
          params,
          get(params, 'batch[0].start'),
          params.start,
          oldOption
        );

        const dataZoomId = params.dataZoomId;
        if (dataZoomId === `\u0000series\u00002\u00000`) {
          // left zoom
          setStockBase((prev) => {
            if (!prev) return prev;
            const newDataZoom = prev.config?.dataZoom || dataZoom;
            newDataZoom[2].start = params.start;
            newDataZoom[2].end = params.end;
            return {
              ...prev,
              config: {
                ...prev.config,
                dataZoom: newDataZoom,
              },
            };
          });
        } else if (dataZoomId === `\u0000series\u00001\u00000`) {
          // bottom zoom
          setStockBase((prev) => {
            if (!prev) return prev;
            const newDataZoom = prev.config?.dataZoom || dataZoom;
            newDataZoom[1].start = params.start;
            newDataZoom[1].end = params.end;
            newDataZoom[0].start = params.start;
            newDataZoom[0].end = params.end;
            return {
              ...prev,
              config: {
                ...prev.config,
                dataZoom: newDataZoom,
              },
            };
          });
        } else {
          // inside zoom
          setStockBase((prev) => {
            if (!prev) return prev;
            const newDataZoom = prev.config?.dataZoom || dataZoom;
            newDataZoom[0].start = get(params, 'batch[0].start');
            newDataZoom[0].end = get(params, 'batch[0].end');
            newDataZoom[1].start = get(params, 'batch[0].start');
            newDataZoom[1].end = get(params, 'batch[0].end');
            return {
              ...prev,
              config: {
                ...prev.config,
                dataZoom: newDataZoom,
              },
            };
          });
        }
      }, 300),
    []
  );

  const handleZoom = useCallback(
    (params: any, oldOption: EChartsOption) => {
      debounceZoom(params, oldOption);
    },
    [debounceZoom]
  );

  const renderChart = () => {
    if (loading) {
      return <Spin />;
    } else {
      if (dataChart) {
        return (
          <StockChart
            config={stockBase?.config}
            data={dataChart}
            handleZoom={handleZoom}
          />
        );
      } else {
        return <div>No data</div>;
      }
    }
  };

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
              setSelectedSymbol(value);
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
        <div>
          <Button
            size="small"
            icon={showDetail ? <DownOutlined /> : <UpOutlined />}
            onClick={() => setShowDetail(showDetail ? false : true)}
          />
        </div>
      </div>

      {showDetail ? (
        <div
          className="flex"
          style={{ height: '120px', flexDirection: 'column' }}
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
                {[1, 2, 3].map((i: number, index: number) => (
                  <InputNumber
                    key={i}
                    step={0.1}
                    size="small"
                    addonBefore={`b_${index + 1}`}
                    value={
                      stockBase?.list_base
                        ? stockBase.list_base[index].value
                        : 0
                    }
                    style={{ marginBottom: '10px', marginRight: '4px' }}
                    onChange={(value: number | null) => {
                      if (!value) return;
                      handleChangeStockBase(index + 1, value);
                    }}
                  />
                ))}
                <div style={{ marginBottom: '10px' }}>
                  <BuyPoint
                    buyPoint={{
                      date: new dayjs.Dayjs(stockBase?.buy_point?.date),
                    }}
                    onCb={handleCbBuyPoint}
                  />
                  {stockBase?.is_blacklist && (
                    <span>
                      is_blacklist
                      <CheckCircleOutlined style={{ color: '#00aa00' }} />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div>
                {listBigSell.map((i: { date: string }) => {
                  return <div key={i.date}>{i.date}</div>;
                })}
                {countEstimate}
              </div>
              <div>
                {minTotal} - {maxTotal} - {averageTotal}
              </div>

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
      <div style={{ flex: 1 }}>{renderChart()}</div>
      {footer()}
    </div>
  );
};

export default StockDetail;
