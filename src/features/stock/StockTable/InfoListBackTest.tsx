import React from 'react';
import { Button, Drawer, Table } from 'antd';
import moment from 'moment';
import BackTestChart from './BackTestChart';
import { getDataChart } from '../utils';

interface InfoListBackTestProp {
  symbol: string;
  children: any;
  backTestData: {
    winRate: number;
    winCount: number;
    list_base: any[];
  };
}

const InfoListBackTest = ({
  backTestData,
  children,
  symbol,
}: InfoListBackTestProp) => {
  const [open, setOpen] = React.useState(false);
  const [dataChart, setDataChart] = React.useState<any>(null);

  const columns = [
    {
      title: 'buyDate',
      render: (data: any) => {
        const buyDate = data.buyItem?.date;
        return (
          <Button onClick={() => handleClickRow(data)}>
            {moment(buyDate).format('YYYY-MM-DD')}
          </Button>
        );
      },
    },
    {
      title: '%vol',
      render: (data: any) => {
        return data.estimated_vol_change.toFixed(2);
      },
    },
    // {
    //   title: 'buyPrice',
    //   render: (data: any) => {
    //     return data.buyPrice.toFixed(2);
    //   },
    // },
    // {
    //   title: 'sellPrice',
    //   render: (data: any) => {
    //     return data.sellPrice.toFixed(2);
    //   },
    // },
    {
      title: 't3 (%)',
      sorter: (a: any, b: any) => a.result - b.result,
      render: (data: any) => {
        return data.result.toFixed(2);
      },
    },
    {
      title: 'buy confidence (%)',
      //   sorter: (a: any, b: any) => a.result - b.result,
      render: (data: any) => {
        return '';
      },
    },
    {
      title: 'sell (%)',
      //   sorter: (a: any, b: any) => a.result - b.result,
      render: (data: any) => {
        return '';
      },
    },
    {
      title: 'chart',
      render: (data: any) => {
        const list = data.addedData.concat(data.list);
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

  const handleClickRow = (record: any) => {
    const fullData = [...record.fullData];
    const buyItem = { ...record.buyItem };
    const newDataChart = getDataChart(fullData, buyItem);
    console.log(newDataChart);
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
        width={1200}
        onClose={onClose}
        open={open}
      >
        <div className="flex">
          <div
            style={{ height: '300px', width: '500px', position: 'absolute' }}
          >
            {dataChart && <BackTestChart data={dataChart} />}
          </div>
          <Table
            style={{ flex: 1, marginLeft: '500px' }}
            dataSource={backTestData?.list_base || []}
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
