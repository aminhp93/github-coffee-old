import { useState, ReactNode, useEffect } from 'react';
import { Button, Drawer, Table, InputNumber } from 'antd';
import { AlignType } from 'rc-table/lib/interface';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart, getBackTest, getSeriesMarkPoint } from '../utils';
import { BackTest, Base, FilterBackTest } from '../types';
import { DATE_FORMAT, BACKTEST_FILTER } from '../constants';

const getCurrentDataChart = (backTestData: BackTest | null) => {
  if (!backTestData) return null;
  const list = backTestData.fullData.slice(0, 100);

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

  const newDataChart = getDataChart({
    data: list,
    grid,
  });
  return newDataChart;
};

interface Props {
  symbol: string;
  children: ReactNode;
  backTestData: BackTest | null;
}

const InfoListBackTest = ({ backTestData, children, symbol }: Props) => {
  console.log(backTestData);
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
  const [currentDataChart, setCurrentDataChart] = useState<any>(
    getCurrentDataChart(backTestData)
  );

  const columns = [
    {
      title: 'buyDate',
      width: 100,

      render: (data: Base) => {
        if ((data.buyIndex !== 0 && !data.buyIndex) || !backTestData) return '';

        const buyDate = backTestData.fullData[data.buyIndex]?.date;
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
      title: 'base_percent (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        return data.base_percent.toFixed(0);
      },
    },
    {
      title: 'closestUpperBaseIndex (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.closestUpperBaseIndex || !data.upperPercent) return;
        return (
          data.closestUpperBaseIndex + ' (' + data.upperPercent.toFixed(0) + ')'
        );
      },
    },
    {
      title: 'closestLowerBaseIndex (%)',
      width: 100,
      align: 'right' as AlignType,
      render: (data: Base) => {
        if (!data.closestLowerBaseIndex || !data.lowerPercent) return;
        return (
          data.closestLowerBaseIndex + ' (' + data.lowerPercent.toFixed(0) + ')'
        );
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
        if (!data.buyIndex || !backTestData) return '';
        const list = backTestData.fullData.slice(
          data.buyIndex - 3,
          data.buyIndex + 5
        );
        const buyItem = backTestData.fullData[data.buyIndex];
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
    if ((record.buyIndex !== 0 && !record.buyIndex) || !backTestData) return;

    const list = backTestData.fullData.slice(
      record.buyIndex > 9 ? record.buyIndex - 10 : record.buyIndex,
      record.buyIndex + 90
    );
    let upperBase;
    let lowerBase;

    const buyItem = { ...backTestData.fullData[record.buyIndex] };
    const sellItem = { ...backTestData.fullData[record.buyIndex - 3] };
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
    const base_length = record.endBaseIndex - record.startBaseIndex;

    const dataMarkLine = [
      // current base
      [
        {
          name: '',
          symbol: 'none',
          label: {
            show: false,
          },
          coord: [
            moment(buyItem.date).add(0, 'days').format(DATE_FORMAT),
            record.base_min,
          ],
        },
        {
          coord: [
            moment(buyItem.date).add(-base_length, 'days').format(DATE_FORMAT),
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
            moment(buyItem.date).add(-base_length, 'days').format(DATE_FORMAT),
            record.base_max,
          ],
        },
      ],
    ];

    if (record.closestUpperBaseIndex) {
      upperBase = {
        ...backTestData.fullData[
          backTestData.listBase[record.closestUpperBaseIndex].startBaseIndex
        ],
      };
      const base_length_upperBase =
        backTestData.listBase[record.closestUpperBaseIndex].endBaseIndex -
        backTestData.listBase[record.closestUpperBaseIndex].startBaseIndex;
      dataMarkLine.push([
        {
          name: '',
          symbol: 'none',

          coord: [
            moment(upperBase.date).add(0, 'days').format(DATE_FORMAT),
            backTestData.listBase[record.closestUpperBaseIndex].base_min,
          ],
        },
        {
          coord: [
            moment(upperBase.date)
              .add(-base_length_upperBase, 'days')
              .format(DATE_FORMAT),
            backTestData.listBase[record.closestUpperBaseIndex].base_min,
          ],
        },
      ]);
      dataMarkLine.push([
        {
          name: '',
          symbol: 'none',

          coord: [
            moment(upperBase.date).add(0, 'days').format(DATE_FORMAT),
            backTestData.listBase[record.closestUpperBaseIndex].base_max,
          ],
        },
        {
          coord: [
            moment(upperBase.date)
              .add(-base_length_upperBase, 'days')
              .format(DATE_FORMAT),
            backTestData.listBase[record.closestUpperBaseIndex].base_max,
          ],
        },
      ]);
    }

    if (record.closestLowerBaseIndex) {
      lowerBase = {
        ...backTestData.fullData[
          backTestData.listBase[record.closestLowerBaseIndex].startBaseIndex
        ],
      };
      const base_length_lowerBase =
        backTestData.listBase[record.closestLowerBaseIndex].endBaseIndex -
        backTestData.listBase[record.closestLowerBaseIndex].startBaseIndex;
      dataMarkLine.push([
        {
          name: '',
          symbol: 'none',

          coord: [
            moment(lowerBase.date).add(0, 'days').format(DATE_FORMAT),
            backTestData.listBase[record.closestLowerBaseIndex].base_min,
          ],
        },
        {
          coord: [
            moment(lowerBase.date)
              .add(-base_length_lowerBase, 'days')
              .format(DATE_FORMAT),
            backTestData.listBase[record.closestLowerBaseIndex].base_min,
          ],
        },
      ]);
      dataMarkLine.push([
        {
          name: '',
          symbol: 'none',

          coord: [
            moment(lowerBase.date).add(0, 'days').format(DATE_FORMAT),
            backTestData.listBase[record.closestLowerBaseIndex].base_max,
          ],
        },
        {
          coord: [
            moment(lowerBase.date)
              .add(-base_length_lowerBase, 'days')
              .format(DATE_FORMAT),
            backTestData.listBase[record.closestLowerBaseIndex].base_max,
          ],
        },
      ]);
    }

    console.log(363, dataMarkLine, seriesMarkPoint, list);

    const newDataChart = getDataChart({
      data: list,
      grid,
      seriesMarkPoint,
      markLine: {
        data: dataMarkLine,
      },
    });
    setDataChart(newDataChart);
  };

  const handleRetest = async () => {
    if (!backTestData) return;
    const filter: FilterBackTest = {
      change_t0,
      change_t0_vol,
      num_high_vol_than_t0,
    };
    const newBackTest = getBackTest(
      backTestData.fullData,
      backTestData.listBase,
      filter
    );

    console.log(newBackTest, 'newBackTest');

    setBackTest(newBackTest);
  };

  useEffect(() => {
    handleRetest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change_t0, change_t0_vol]);

  useEffect(() => {
    if (backTestData) {
      setBackTest(backTestData);
      setCurrentDataChart(getCurrentDataChart(backTestData));
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
              {currentDataChart && <BackTestChart data={currentDataChart} />}
            </div>
            <div style={{ height: '100%', width: '100%' }}>
              {dataChart && <BackTestChart data={dataChart} />}
            </div>
          </div>
          {backTest && (
            <Table
              style={{ flex: 1, marginTop: '20px', overflow: 'auto' }}
              dataSource={backTest.filteredBase.map((i: any) => {
                i.key = i.buyIndex;
                return i;
              })}
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
