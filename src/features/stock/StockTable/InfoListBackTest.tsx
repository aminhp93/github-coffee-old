import { useState, ReactNode, useEffect } from 'react';
import { Button, Drawer, Table, InputNumber } from 'antd';
import { AlignType } from 'rc-table/lib/interface';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart, mapHistoricalQuote, getBackTest } from '../utils';
import { BackTest, Base, CustomSymbol } from '../types';
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
      title: 'buy conf (%)',
      width: 100,
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'sell (%)',
      width: 100,
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
        const dataChart = getDataChart(list, data.fullData[data.buyIndex]);

        return (
          <div style={{ width: '150px', height: '50px' }}>
            <BackTestChart data={dataChart as any} />
          </div>
        );
      },
    },
    {
      title: 'other',
      render: (data: Base) => {
        return '';
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
    const newDataChart = getDataChart(list, buyItem);
    setDataChart(newDataChart);
  };

  const handleRetest = async () => {
    if (!backTestData) return;
    const filter = {
      change_t0,
      change_t0_vol,
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
        onClick={showDrawer}
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
        <div className="flex" style={{ flexDirection: 'column' }}>
          <div
            className="flex"
            style={{
              height: '100%',
            }}
          >
            <div style={{ height: '300px', width: '100%' }}>
              <CurrentChart symbol={symbol} />
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              {dataChart && <BackTestChart data={dataChart} />}
            </div>
          </div>
          {backTest && (
            <Table
              style={{ flex: 1 }}
              dataSource={backTest.filteredBase}
              columns={columns}
              bordered
              size="small"
              pagination={false}
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
        const dataChart = getDataChart(data, null);
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
