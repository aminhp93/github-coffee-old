import { useState, ReactNode } from 'react';
import { Button, Drawer, Table } from 'antd';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart } from '../utils';
import { BackTest, Base } from '../types';
import { DATE_FORMAT } from '../constants';

interface Props {
  symbol: string;
  children: ReactNode;
  backTestData: BackTest | null;
}

const InfoListBackTest = ({ backTestData, children, symbol }: Props) => {
  console.log(backTestData);
  const [open, setOpen] = useState(false);
  const [dataChart, setDataChart] = useState<any>(null);

  const columns = [
    {
      title: 'buyDate',
      render: (data: Base) => {
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
        if (!data.estimated_vol_change) return '';

        return data.estimated_vol_change.toFixed(2);
      },
    },
    {
      title: 't3 (%)',
      sorter: (a: Base, b: Base) => (a.t3 && b.t3 ? a.t3 - b.t3 : 0),
      render: (data: Base) => {
        if (!data.t3) return '';
        return data.t3.toFixed(2);
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
        if (!data.addedData || !data.list) return '';
        const list = data.addedData.concat(data.list as any);
        const dataChart = getDataChart(list, data.buyItem);

        return (
          <div style={{ width: '150px', height: '50px' }}>
            <BackTestChart data={dataChart} />
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
    const fullData = [...record.fullData];
    const buyItem = { ...record.fullData[record.buyIndex] };
    const newDataChart = getDataChart(fullData, buyItem);
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
              {dataChart && <BackTestChart data={dataChart} />}
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
