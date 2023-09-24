/* eslint-disable @typescript-eslint/no-explicit-any */

// Import library
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  InputNumber,
  notification,
  Select,
  Spin,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { debounce, get } from 'lodash';

// Import components
import { DATE_FORMAT } from './constants';
import StockService from './service';
import StockChart from './stockChart/StockChart';
// import BuyPoint from './stockTable/BuyPoint';
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
  // analyse,
} from './utils';
import { dataZoom } from 'features/stock/stockChart/StockChart.constants';
import useStockStore from './Stock.store';

const StockDetail = () => {
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);

  const [loading, setLoading] = useState<boolean>(false);
  const [dataChart, setDataChart] = useState<StockChartData | undefined>();
  const [stockBase, setStockBase] = useState<StockBase | undefined>();
  const [stockData, setStockData] = useState<StockData | undefined>();
  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [date, setDate] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [listAllSymbols, setListAllSymbols] = useState<string[]>([]);
  const [selectedVolumeField, setSelectedVolumeField] = useState<
    'dealVolume' | 'totalVolume'
  >('totalVolume');

  const handleChangeDate = (data: dayjs.Dayjs | null) => {
    if (!data) return;
    setDate(data);
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

  const getData = async (
    symbol: string,
    date: dayjs.Dayjs | undefined,
    volumeField: 'dealVolume' | 'totalVolume' = 'dealVolume'
  ) => {
    try {
      if (!date || !symbol) return;
      setLoading(true);
      const listPromise: any = [
        StockService.getStockBase(symbol),
        getTodayData(date, [symbol]),
        StockService.getStockDataFromSupabase({
          startDate: date.add(-18, 'month').format(DATE_FORMAT),
          endDate: date.format(DATE_FORMAT),
          listSymbols: [symbol],
        }),
      ];

      const [resStockBase, resFireant, res] = await Promise.all(listPromise);

      setLoading(false);

      let newStockBase = {};
      if (resStockBase.data?.length === 1) {
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

  // const handleCbBuyPoint = (data: dayjs.Dayjs | undefined) => {
  //   setStockBase((prev) => {
  //     if (!prev) return prev;
  //     return {
  //       ...prev,
  //       symbol: selectedSymbol,
  //       buy_point: data
  //         ? {
  //             date: data.format(DATE_FORMAT),
  //           }
  //         : undefined,
  //     };
  //   });
  // };

  useEffect(() => {
    if (!stockBase?.symbol) return;
    (async () => {
      try {
        if (stockBase?.id) {
          stockBase.buy_point = {
            date: '',
          };
          if (stockBase?.list_base && stockBase.list_base[2]) {
            // remove list_base[2] because it is not used
            stockBase.list_base = stockBase.list_base.filter((i) => i.id !== 3);
          }

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
    getData(selectedSymbol, date, selectedVolumeField);
  }, [selectedSymbol, date, selectedVolumeField]);

  useEffect(() => {
    (async () => {
      const res = await StockService.getAllStockBase();
      if (!res.data) return;
      setListAllSymbols(res.data.map((i) => i.symbol));
    })();
  }, []);

  const { risk, target } = evaluateStockBase(stockBase, stockData?.fullData);
  const { minTotal, maxTotal, averageTotal } = getMinTotalValue(stockData);
  // const { listBigSell, countEstimate } = analyse(stockData, stockBase);

  const debounceZoom = useMemo(
    () =>
      debounce(async (params: any) => {
        // Zoom using toolbox and call api with smaller resolution
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
    (params: any) => {
      debounceZoom(params);
    },
    [debounceZoom]
  );

  const renderChart = () => {
    if (loading) {
      return <Spin />;
    }
    if (dataChart) {
      return (
        <StockChart
          config={stockBase?.config}
          data={dataChart}
          handleZoom={handleZoom}
        />
      );
    }
    return <div>No data</div>;
  };

  const renderStockBase = () => {
    return showDetail ? (
      <div className="flex">
        {[1, 2].map((i: number, index: number) => (
          <InputNumber
            key={i}
            step={0.1}
            size="small"
            addonBefore={`b_${index + 1}`}
            value={stockBase?.list_base ? stockBase.list_base[index].value : 0}
            style={{ marginBottom: '10px', marginRight: '4px' }}
            onChange={(value: number | null) => {
              handleChangeStockBase(index + 1, value!);
            }}
          />
        ))}
        <div style={{ marginBottom: '10px' }}>
          {/* <BuyPoint
            buyPoint={{
              date: stockBase?.buy_point?.date
                ? dayjs(stockBase.buy_point.date)
                : undefined,
            }}
            onCb={handleCbBuyPoint}
          /> */}

          <Switch
            checkedChildren="is_blacklist"
            unCheckedChildren="is_blacklist"
            checked={!!stockBase?.is_blacklist}
            onChange={(checked) => {
              setStockBase((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  is_unpotential: checked,
                };
              });
            }}
          />
          <Switch
            checkedChildren="is_unpotential"
            unCheckedChildren="is_unpotential"
            checked={!!stockBase?.is_unpotential}
            onChange={(checked) => {
              setStockBase((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  is_unpotential: checked,
                };
              });
            }}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  };

  const header = (
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
      <div className="flex">
        <div style={{ marginLeft: '10px' }}>
          T: {target && target.toFixed(0) + '%'}
        </div>
        <div style={{ marginLeft: '10px' }}>
          R: {risk && risk.toFixed(0) + '%'}
        </div>
      </div>
      <div>
        {/* {listBigSell.map((i: { date: string }) => {
          return <div key={i.date}>{i.date}</div>;
        })}
        {countEstimate} */}
        {minTotal} - {maxTotal} - {averageTotal}
      </div>
    </div>
  );

  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {renderStockBase()}
      <div
        className="flex"
        style={{
          justifyContent: 'flex-end',
          height: '50px',
          alignItems: 'center',
        }}
      >
        <div className="flex" style={{ alignItems: 'center' }}>
          <div>
            <Button
              size="small"
              style={{ marginRight: 8 }}
              icon={showDetail ? <DownOutlined /> : <UpOutlined />}
              onClick={() => setShowDetail(!showDetail)}
            />
          </div>
          <RefreshButton onClick={() => getData(selectedSymbol, date)} />
          <DatePicker
            style={{ marginLeft: 8 }}
            size="small"
            value={date}
            onChange={handleChangeDate}
            format={DATE_FORMAT}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="StockDetailChart flex height-100 width-100"
      style={{ flexDirection: 'column' }}
    >
      {header}
      <Divider />
      <div style={{ flex: 1 }}>{renderChart()}</div>
      {footer}
    </div>
  );
};

export default StockDetail;
