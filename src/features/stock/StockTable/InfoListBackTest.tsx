import { useState, ReactNode, useEffect } from 'react';
import { Button, Drawer, Table, InputNumber } from 'antd';
import BackTestChart from './BackTestChart';
import { getBackTest, mapDataChart } from '../utils';
import { BackTest, Base, FilterBackTest } from '../types';
import { BACKTEST_FILTER } from '../constants';
import InfoListBackTestColumns from './InfoListBackTestColumns';

const getCurrentDataChart = (backTestData: BackTest | null) => {
  if (!backTestData) return null;
  const record = backTestData.listBase[0];

  return mapDataChart(backTestData, record);
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
  const [change_t0, setChange_t0] = useState<number | null>(
    BACKTEST_FILTER.change_t0
  );
  const [change_t0_vol, setChange_t0_vol] = useState<number | null>(
    BACKTEST_FILTER.change_t0_vol
  );
  const [num_high_vol_than_t0, setNum_high_vol_than_t0] = useState<
    number | null
  >(BACKTEST_FILTER.num_high_vol_than_t0);
  const [t0_over_base_max, setT0_over_base_max] = useState<number | null>(
    BACKTEST_FILTER.t0_over_base_max
  );
  const [currentDataChart, setCurrentDataChart] = useState<any>(
    getCurrentDataChart(backTestData)
  );

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClickRow = (record: Base) => {
    setDataChart(mapDataChart(backTestData, record));
  };

  const handleRetest = async () => {
    if (!backTestData) return;
    const filter: FilterBackTest = {
      change_t0,
      change_t0_vol,
      num_high_vol_than_t0,
      t0_over_base_max,
    };
    const newBackTest = getBackTest(
      backTestData.fullData,
      backTestData.listBase,
      filter
    );

    console.log(newBackTest, 'newBackTest');

    setBackTest(newBackTest);
  };

  const handleReset = () => {
    setChange_t0(null);
    setChange_t0_vol(null);
    setNum_high_vol_than_t0(null);
    setT0_over_base_max(null);
  };

  const handleDefault = () => {
    setChange_t0(BACKTEST_FILTER.change_t0);
    setChange_t0_vol(BACKTEST_FILTER.change_t0_vol);
    setNum_high_vol_than_t0(BACKTEST_FILTER.num_high_vol_than_t0);
    setT0_over_base_max(BACKTEST_FILTER.t0_over_base_max);
  };

  useEffect(() => {
    handleRetest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change_t0, change_t0_vol, num_high_vol_than_t0, t0_over_base_max]);

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
        className="InfoListBackTestDrawer"
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
              <InputNumber
                size="small"
                addonBefore="t0_over_base_max"
                onChange={(value) => setT0_over_base_max(value as number)}
                value={t0_over_base_max}
              />
              <Button size="small" onClick={handleReset}>
                reset
              </Button>
              <Button size="small" onClick={handleDefault}>
                default
              </Button>
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
              columns={InfoListBackTestColumns({
                handleClickRow,
                backTestData,
              })}
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
