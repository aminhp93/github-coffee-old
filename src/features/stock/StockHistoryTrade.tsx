import { Button, notification, Table } from 'antd';
import dayjs from 'dayjs';
import { AccountService } from 'features/stock/service';
import { sum, uniqBy } from 'lodash';
import { useEffect, useState } from 'react';

type Props = {
  onClose?: () => void;
};

function StockHistoryTrade(props: Props) {
  const filterObj = {
    startDate: '2020-07-01',
    endDate: dayjs().format('YYYY-MM-DD'),
    orderStatus: '4',
  };

  const [listOrdersHistory, setListOrdersHistory] = useState([]);
  const defaultColumns: any = [
    {
      title: 'So hieu lenh',
      dataIndex: 'orderID',
      key: 'orderID',
      width: 200,
    },
    {
      title: 'Ngay',
      align: 'right' as 'right',
      render: (data: any) => {
        return dayjs(data.transactionDate).format('YYYY-MM-DD');
      },
    },
    {
      title: 'Ma CK',
      align: 'center' as 'center',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Lenh',
      align: 'center' as 'center',
      render: (data: any) => {
        if (data.execType === 'NB') {
          return <div style={{ color: 'green' }}>Mua</div>;
        } else if (data.execType === 'NS') {
          return <div style={{ color: 'red' }}>Ban</div>;
        } else {
          return '';
        }
      },
    },
    {
      title: 'KL dat',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.orderQuantity &&
          Number(data.orderQuantity).toLocaleString('en-US')
        );
      },
    },
    {
      title: 'Gia dat',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.orderPrice && Number(data.orderPrice).toLocaleString('en-US')
        );
      },
    },
    {
      title: 'KL khop',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.matchQuantity &&
          Number(data.matchQuantity).toLocaleString('en-US')
        );
      },
    },
    {
      title: 'Gia khop TB',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.matchAveragePrice &&
          Number(data.matchAveragePrice).toLocaleString('en-US')
        );
      },
    },
    {
      title: 'Trang thai',
      render: (data: any) => {
        if (data.orderStatus === '4') {
          return 'Khop';
        } else if (data.orderStatus === '5') {
          return 'Lenh het han';
        } else {
          return '';
        }
      },
    },
    {
      title: 'Phi',
      align: 'right' as 'right',
      render: (data: any) => {
        return data.feeOrder && data.feeOrder.toLocaleString('en-US');
      },
    },
    {
      title: 'Thoi gian',
      render: (data: any) => {
        return data.orderTime;
      },
    },
  ];

  const mainColumns: any = [
    {
      title: 'Ngay',
      align: 'right' as 'right',
      render: (data: any) => {
        return dayjs(data.transactionDate).format('YYYY-MM-DD');
      },
    },
    {
      title: 'Ma CK',
      align: 'center' as 'center',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Lenh',
      align: 'center' as 'center',
      render: (data: any) => {
        if (data.execType === 'NB') {
          return <div style={{ color: 'green' }}>Mua</div>;
        } else if (data.execType === 'NS') {
          return <div style={{ color: 'red' }}>Ban</div>;
        } else {
          return '';
        }
      },
    },
    {
      title: 'KL khop',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.matchQuantity &&
          Number(data.matchQuantity).toLocaleString('en-US')
        );
      },
    },
    {
      title: 'Gia khop TB',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.matchAveragePrice &&
          Number(data.matchAveragePrice).toLocaleString('en-US')
        );
      },
    },
    {
      title: '+/-',
      align: 'right' as 'right',
      render: (data: any) => {
        return data.finalChange;
      },
    },
    {
      title: 'Total Amount',
      align: 'right' as 'right',
      render: (data: any) => {
        return (
          data.initialAmount &&
          Number(data.initialAmount).toLocaleString('en-US')
        );
      },
    },
  ];

  const [columns, setColumns] = useState(mainColumns);

  useEffect(() => {
    (async () => {
      try {
        const res = await AccountService.postAuthToken({
          username: 'username',
          password: 'password',
        });
        const res2 = await AccountService.fetchOrdersHistory(
          res.data.token,
          filterObj.startDate,
          filterObj.endDate
        );
        if (res2.data) {
          const filteredList = uniqBy(
            res2.data.filter(
              (i: any) => i.orderStatus === filterObj.orderStatus
            ),
            'orderID'
          );
          let ignoreSells: any = [];
          const mappedList: any = filteredList.map((i: any) => {
            if (
              ignoreSells.filter((j: any) => j.orderID === i.orderID).length > 0
            )
              return i;
            if (i.execType === 'NS') {
              const listSell: any = [i];
              let stop = false;
              filteredList.forEach((j: any) => {
                if (!stop) {
                  if (
                    j.symbol === i.symbol &&
                    j.transactionDate < i.transactionDate &&
                    j.execType === 'NB'
                  ) {
                    ignoreSells = ignoreSells.concat(listSell);
                    stop = true;
                  }

                  if (
                    j.symbol === i.symbol &&
                    (j.transactionDate < i.transactionDate ||
                      j.transactionDate === i.transactionDate) &&
                    i.orderID !== j.orderID &&
                    j.execType === 'NS'
                  ) {
                    listSell.push(j);
                  }
                }
              });

              const listBuy: any = [];
              let totalVolumeBuy = 0;
              const totalVolumeSell = sum(
                listSell.map((i: any) => Number(i.matchQuantity))
              );

              let stop2 = false;
              filteredList.forEach((j: any) => {
                if (!stop2) {
                  if (totalVolumeBuy === totalVolumeSell) stop2 = true;

                  if (
                    j.symbol === i.symbol &&
                    j.execType === 'NB' &&
                    j.transactionDate < i.transactionDate
                  ) {
                    totalVolumeBuy += Number(j.matchQuantity);
                    listBuy.push(j);
                  }
                }
              });

              const start = sum(
                listBuy.map(
                  (i: any) =>
                    Number(i.matchQuantity) * Number(i.matchAveragePrice)
                )
              );
              const end = sum(
                listSell.map(
                  (i: any) =>
                    Number(i.matchQuantity) * Number(i.matchAveragePrice)
                )
              );
              i.finalChange = (((end - start) / start) * 100).toFixed(2);
              i.initialAmount = start;
            }
            return i;
          });
          setListOrdersHistory(mappedList);
        }
      } catch (e) {
        notification.error({ message: 'Error' });
      }
    })();
  }, [filterObj.endDate, filterObj.orderStatus, filterObj.startDate, props]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Start Date: {filterObj.startDate}</div>
        <div>End Date: {filterObj.endDate}</div>
        <div>OrderStatus: {filterObj.orderStatus === '4' ? 'Khop' : ''}</div>
      </div>

      <Button size="small" onClick={() => setColumns(defaultColumns)}>
        Default Columns
      </Button>
      <Button size="small" onClick={() => setColumns(mainColumns)}>
        Main Columns
      </Button>
      <Table
        dataSource={listOrdersHistory}
        columns={columns}
        pagination={false}
        scroll={{ y: 1200 }}
      />
    </div>
  );
}

export default StockHistoryTrade;
