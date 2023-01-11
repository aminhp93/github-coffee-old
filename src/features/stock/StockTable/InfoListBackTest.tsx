import { useState, ReactNode, useEffect } from 'react';
import { Button, Drawer, Table, InputNumber } from 'antd';
import { AlignType } from 'rc-table/lib/interface';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import {
  getDataChart,
  mapHistoricalQuote,
  getBackTest,
  getSeriesMarkPoint,
} from '../utils';
import { BackTest, Base, CustomSymbol, FilterBackTest } from '../types';
import { DATE_FORMAT, DEFAULT_DATE, BACKTEST_FILTER } from '../constants';
import StockService from '../service';

interface Props {
  symbol: string;
  children: ReactNode;
  backTestData: BackTest | null;
}

const InfoListBackTest = ({ backTestData, children, symbol }: Props) => {
  const [backTest, setBackTest] = useState<BackTest | null>(backTestData);
  const [open, setOpen] = useState(false);
  const [dataChart, setDataChart] = useState<any>(null);
  const [change_t0, setChange_t0] = useState<number>(BACKTEST_FILTER.change_t0);
  const [change_t0_vol, setChange_t0_vol] = useState<number>(
    BACKTEST_FILTER.change_t0_vol
  );
  const [num_high_vol_than_t0, setNum_high_vol_than_t0] = useState<number>(
    BACKTEST_FILTER.num_high_vol_than_t0
  );

  const columns = [
    {
      title: 'buyDate',
      width: 100,
      render: (data: Base) => {
        if (!data.buyIndex) return '';
        const buyDate = data.fullData[data.buyIndex]?.date;
        return (
          <Button onClick={() => handleClickRow(data)}>
            {moment(buyDate).format(DATE_FORMAT)}
          </Button>
        );
      },
    },
    {
      title: 'change_t0_vol (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0_vol && b.change_t0_vol
          ? a.change_t0_vol - b.change_t0_vol
          : 0,
      render: (data: Base) => {
        if (!data.change_t0_vol) return '';

        return data.change_t0_vol.toFixed(0);
      },
    },

    {
      title: 'change_t0 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t0 && b.change_t0 ? a.change_t0 - b.change_t0 : 0,
      render: (data: Base) => {
        if (!data.change_t0) return '';
        return data.change_t0.toFixed(2);
      },
    },
    {
      title: 'num_high_vol_than_t0 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.num_high_vol_than_t0 && b.num_high_vol_than_t0
          ? a.num_high_vol_than_t0 - b.num_high_vol_than_t0
          : 0,
      render: (data: Base) => {
        return data.num_high_vol_than_t0;
      },
    },
    {
      title: 'other',
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'chart',
      width: 150,
      render: (data: Base) => {
        // get data in data.fullData from data.buyIndex to next 5 items
        if (!data.buyIndex) return '';
        const list = data.fullData.slice(data.buyIndex - 3, data.buyIndex + 5);
        const buyItem = data.fullData[data.buyIndex];
        const seriesMarkPoint = getSeriesMarkPoint({ buyItem });
        const dataChart = getDataChart({
          data: list,
          seriesMarkPoint,
        });

        return (
          <div style={{ width: '150px', height: '50px' }}>
            <BackTestChart data={dataChart as any} />
          </div>
        );
      },
    },

    {
      title: 'change_t3 (%)',
      width: 100,
      align: 'right' as AlignType,
      sorter: (a: Base, b: Base) =>
        a.change_t3 && b.change_t3 ? a.change_t3 - b.change_t3 : 0,
      render: (data: Base) => {
        if (!data.change_t3) return '';
        return data.change_t3.toFixed(2);
      },
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClickRow = (record: Base) => {
    if (!record.buyIndex) return;
    const list = record.fullData.slice(
      record.buyIndex - 10,
      record.buyIndex + 40
    );

    const buyItem = { ...record.fullData[record.buyIndex] };
    const sellItem = { ...record.fullData[record.buyIndex - 3] };
    const grid = [
      {
        left: 20,
        right: 20,
        top: 20,
        height: '70%',
      },
      {
        left: 20,
        right: 20,
        height: '20%',
        bottom: 0,
      },
    ];

    const seriesMarkPoint = getSeriesMarkPoint({
      buyItem,
      sellItem,
      offset: 20,
    });

    const markLine = {
      data: [
        [
          {
            name: '',
            symbol: 'none',

            coord: [
              moment(buyItem.date).add(0, 'days').format(DATE_FORMAT),
              record.base_min,
            ],
          },
          {
            coord: [
              moment(buyItem.date).add(-50, 'days').format(DATE_FORMAT),
              record.base_min,
            ],
          },
        ],
        [
          {
            name: '',
            symbol: 'none',

            coord: [
              moment(buyItem.date).add(0, 'days').format(DATE_FORMAT),
              record.base_max,
            ],
          },
          {
            coord: [
              moment(buyItem.date).add(-50, 'days').format(DATE_FORMAT),
              record.base_max,
            ],
          },
        ],
      ],
    };

    const newDataChart = getDataChart({
      data: list,
      grid,
      seriesMarkPoint,
      markLine,
    });
    console.log(newDataChart);
    setDataChart(newDataChart);
  };

  const handleRetest = async () => {
    if (!backTestData) return;
    const filter: FilterBackTest = {
      change_t0,
      change_t0_vol,
      num_high_vol_than_t0,
    };
    const newBackTest = getBackTest(backTestData.listBase, filter);

    setBackTest(newBackTest);
  };

  useEffect(() => {
    handleRetest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change_t0, change_t0_vol]);

  useEffect(() => {
    if (backTestData) {
      setBackTest(backTestData);
    }
  }, [backTestData]);

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={() => (backTest ? showDrawer() : null)}
        style={{ background: 'transparent', border: 'none' }}
      >
        {children}
      </Button>

      <Drawer
        title={
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <div>{symbol}</div>
            <div>
              <InputNumber
                size="small"
                addonBefore="change_t0"
                onChange={(value) => setChange_t0(value as number)}
                value={change_t0}
              />
              <InputNumber
                size="small"
                addonBefore="change_t0_vol"
                onChange={(value) => setChange_t0_vol(value as number)}
                value={change_t0_vol}
              />
              <InputNumber
                size="small"
                addonBefore="num_high_vol_than_t0"
                onChange={(value) => setNum_high_vol_than_t0(value as number)}
                value={num_high_vol_than_t0}
              />
            </div>
            {backTest && (
              <div>{`${backTest.winRate.toFixed(0)}% - ${backTest.winCount}/${
                backTest.filteredBase.length
              }`}</div>
            )}
          </div>
        }
        placement="right"
        width={'100%'}
        onClose={onClose}
        open={open}
      >
        <div className="flex height-100" style={{ flexDirection: 'column' }}>
          <div
            className="flex"
            style={{
              height: '300px',
            }}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <CurrentChart symbol={symbol} />
            </div>
            <div style={{ height: '100%', width: '100%' }}>
              {dataChart && <BackTestChart data={dataChart} />}
            </div>
          </div>
          {backTest && (
            <Table
              style={{ flex: 1, marginTop: '20px', overflow: 'auto' }}
              dataSource={backTest.filteredBase}
              columns={columns}
              bordered
              size="small"
              pagination={false}
              // scroll={{ y: 1000 }}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};

export default InfoListBackTest;

interface CurrentChartProps {
  symbol: string;
}

const CurrentChart = ({ symbol }: CurrentChartProps) => {
  const [currentDataChart, setCurrentDataChart] = useState<any>(null);

  const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
  const endDate = DEFAULT_DATE.format(DATE_FORMAT);

  const getData = () => {
    const listPromises: any = [];

    [0, 20, 40].forEach((i: number) => {
      listPromises.push(
        StockService.getHistoricalQuotes(
          { symbol, startDate, endDate, offset: i },
          mapHistoricalQuote
        )
      );
    });
    Promise.all(listPromises)
      .then((res: CustomSymbol[]) => {
        const data = res.map((item) => item.last20HistoricalQuote).flat();
        const dataChart = getDataChart({ data });
        console.log(dataChart);
        setCurrentDataChart(dataChart);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentDataChart && <BackTestChart data={currentDataChart as any} />;
};
