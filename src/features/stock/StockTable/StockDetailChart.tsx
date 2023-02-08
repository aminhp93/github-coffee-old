import BackTestChart from './BackTestChart';
import moment from 'moment';
import { DATE_FORMAT } from '../constants';
import { mapDataChart, calculateStockBase } from '../utils';
import StockService from '../service';
import { useEffect, useState } from 'react';
import { StockData } from '../types';
import { DatePicker, InputNumber, notification, Button } from 'antd';

const { RangePicker } = DatePicker;

interface Props {
  symbol: string;
  fullData: StockData[];
}

const StockDetailChart = ({ symbol, fullData }: Props) => {
  const [dataChart, setDataChart] = useState<any>(null);
  const [stockBase, setStockBase] = useState<any>({});

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

  useEffect(() => {
    const listMarkLines = [];
    if (stockBase?.support_base) {
      listMarkLines.push([
        {
          coord: [
            stockBase.support_base.endBaseDate,
            stockBase.support_base.base_min,
          ],
        },
        {
          coord: [
            stockBase.support_base.startBaseDate,
            stockBase.support_base.base_min,
          ],
        },
      ]);
      listMarkLines.push([
        {
          coord: [
            stockBase.support_base.endBaseDate,
            stockBase.support_base.base_max,
          ],
        },
        {
          coord: [
            stockBase.support_base.startBaseDate,
            stockBase.support_base.base_max,
          ],
        },
      ]);
    }
    if (stockBase?.target_base) {
      listMarkLines.push([
        {
          coord: [
            stockBase.target_base.endBaseDate,
            stockBase.target_base.base_min,
          ],
        },
        {
          coord: [
            stockBase.target_base.startBaseDate,
            stockBase.target_base.base_min,
          ],
        },
      ]);
      listMarkLines.push([
        {
          coord: [
            stockBase.target_base.endBaseDate,
            stockBase.target_base.base_max,
          ],
        },
        {
          coord: [
            stockBase.target_base.startBaseDate,
            stockBase.target_base.base_max,
          ],
        },
      ]);
    }

    const filteredData = fullData.filter((i: StockData) => i.symbol === symbol);
    let fullDataChart: any = [];
    if (filteredData.length > 0) {
      fullDataChart = filteredData[0].fullData || [];
    }

    setDataChart(mapDataChart({ fullData: fullDataChart, listMarkLines }));
  }, [symbol, fullData, stockBase]);

  useEffect(() => {
    const init = async () => {
      const res = await StockService.getStockBase(symbol);
      if (res.data && res.data.length === 1) {
        setStockBase(res.data[0]);
      } else {
        setStockBase({});
      }
    };
    init();
  }, [symbol]);

  console.log('stockBase', stockBase);

  const { risk, target } = calculateStockBase(stockBase);

  return (
    <div
      className="flex height-100 width-100"
      style={{ flexDirection: 'column' }}
    >
      <div style={{ height: '200px' }}>
        {symbol && (
          <div>
            {symbol}{' '}
            <Button size="small" onClick={updateStockBase}>
              Update
            </Button>
          </div>
        )}
        <div className="flex">
          <div>
            <div>
              Support base
              <div style={{ marginTop: '10px' }}>
                <InputNumber
                  step={0.1}
                  size="small"
                  addonBefore="base_min"
                  value={stockBase?.support_base?.base_min}
                  onChange={(value: any) => {
                    handleChangeStockBase('support_base', {
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
                  value={stockBase?.support_base?.base_max}
                  onChange={(value: any) => {
                    handleChangeStockBase('support_base', {
                      base_max: value,
                    });
                  }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <RangePicker
                  size="small"
                  onChange={(dates) => {
                    handleChangeStockBase('support_base', {
                      startBaseDate:
                        dates && dates[0] && dates[0].format(DATE_FORMAT),
                      endBaseDate:
                        dates && dates[1] && dates[1].format(DATE_FORMAT),
                    });
                  }}
                  value={
                    stockBase && stockBase.support_base
                      ? [
                          moment(stockBase.support_base.startBaseDate),
                          moment(stockBase.support_base.endBaseDate),
                        ]
                      : null
                  }
                  format={DATE_FORMAT}
                />
              </div>
            </div>
          </div>
          <div style={{ marginLeft: '20px' }}>
            <div>
              Target base
              <div style={{ marginTop: '10px' }}>
                <InputNumber
                  step={0.1}
                  size="small"
                  addonBefore="base_min"
                  value={stockBase?.target_base?.base_min}
                  onChange={(value: any) => {
                    handleChangeStockBase('target_base', {
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
                  value={stockBase?.target_base?.base_max}
                  onChange={(value: any) => {
                    handleChangeStockBase('target_base', {
                      base_max: value,
                    });
                  }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <RangePicker
                  size="small"
                  onChange={(dates) => {
                    handleChangeStockBase('target_base', {
                      startBaseDate:
                        dates && dates[0] && dates[0].format(DATE_FORMAT),
                      endBaseDate:
                        dates && dates[1] && dates[1].format(DATE_FORMAT),
                    });
                  }}
                  value={
                    stockBase && stockBase.target_base
                      ? [
                          moment(stockBase.target_base.startBaseDate),
                          moment(stockBase.target_base.endBaseDate),
                        ]
                      : null
                  }
                  format={DATE_FORMAT}
                />
              </div>
            </div>
          </div>
          <div style={{ marginLeft: '20px' }}>
            <div>Risk: {risk && risk.toFixed(0) + '%'}</div>
            <div>target: {target && target.toFixed(0) + '%'}</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {dataChart && <BackTestChart data={dataChart} />}{' '}
      </div>
    </div>
  );
};

export default StockDetailChart;
