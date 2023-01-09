import { useState, ReactNode, useEffect } from 'react';
import { Button, Drawer, Table, InputNumber } from 'antd';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart, mapHistoricalQuote } from '../utils';
import { BackTest, Base, CustomSymbol } from '../types';
import { DATE_FORMAT, DEFAULT_DATE, BACKTEST_FILTER } from '../constants';
import StockService from '../service';

interface Props {
  symbol: string;
  children: ReactNode;
  backTestData: BackTest | null;
}

const InfoListBackTest = ({ backTestData, children, symbol }: Props) => {
  const [open, setOpen] = useState(false);
  const [dataChart, setDataChart] = useState<any>(null);
  const [change_t0, setChange_t0] = useState<number>(BACKTEST_FILTER.change_t0);
  const [change_t3, setChange_t3] = useState<number>(BACKTEST_FILTER.change_t3);
  const [change_t0_vol, setChange_t0_vol] = useState<number>(
    BACKTEST_FILTER.change_t0_vol
  );

  const columns = [
    {
      title: 'buyDate',
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
      title: '%vol',
      render: (data: Base) => {
        if (!data.change_t0_vol) return '';

        return data.change_t0_vol.toFixed(2);
      },
    },
    {
      title: 't3 (%)',
      sorter: (a: Base, b: Base) =>
        a.change_t3 && b.change_t3 ? a.change_t3 - b.change_t3 : 0,
      render: (data: Base) => {
        if (!data.change_t3) return '';
        return data.change_t3.toFixed(2);
      },
    },
    {
      title: 'buy confidence (%)',
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'sell (%)',
      render: (data: Base) => {
        return '';
      },
    },
    {
      title: 'chart',
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
      record.buyIndex + 20
    );

    const buyItem = { ...record.fullData[record.buyIndex] };
    const newDataChart = getDataChart(list, buyItem);
    setDataChart(newDataChart);
  };

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
                value={change_t0}
              />
              <InputNumber
                size="small"
                addonBefore="change_t3"
                value={change_t3}
              />
              <InputNumber
                size="small"
                addonBefore="change_t0_vol"
                value={change_t0_vol}
              />
            </div>
            <div>{` ${backTestData?.winRate} - ${backTestData?.winCount}/${columns.length}`}</div>
          </div>
        }
        placement="right"
        width={'100%'}
        onClose={onClose}
        open={open}
      >
        <div className="flex">
          <div
            className="flex"
            style={{
              height: '100%',
              width: '500px',
              position: 'absolute',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '300px', width: '100%' }}>
              <CurrentChart symbol={symbol} />
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              {dataChart && <BackTestChart data={dataChart} />}
            </div>
          </div>
          <Table
            style={{ flex: 1, marginLeft: '500px' }}
            dataSource={backTestData?.listBase || []}
            columns={columns}
            bordered
            size="small"
            pagination={false}
          />
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
