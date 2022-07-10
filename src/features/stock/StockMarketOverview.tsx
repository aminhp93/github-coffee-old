import { useState, useEffect } from 'react';
import { keyBy, meanBy } from 'lodash';
import { notification, Table, Button } from 'antd';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons';

import { StockService } from 'services';

export default function StockMarketOverview() {
  const [listWatchlists, setListWatchlists] = useState([]);
  const [data1, setData1] = useState([] as any);
  const [data2, setData2] = useState([] as any);
  const [data3, setData3] = useState([] as any);
  const [data4, setData4] = useState([] as any);
  const [data5, setData5] = useState([] as any);
  const [filtered, setFiltered] = useState(false);
  const [editable, setEditable] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [changePercentMin, setChangePercentMin] = useState(0);
  const [changePercentMax, setChangePercentMax] = useState(0);
  const [estimatedVolumeChange, setEstimatedVolumeChange] = useState(0);

  const fetch = async (listWatchlists: any, watchlistName: string) => {
    const xxx = keyBy(listWatchlists, 'name');
    const xxx2 = xxx[watchlistName];
    const listPromises: any = [];
    ((xxx2 || {}).symbols || []).forEach((i: any) => {
      listPromises.push(
        StockService.getHistoricalQuotes(i, undefined, undefined, 'fireant')
      );
    });
    return Promise.all(listPromises).then((res) => {
      let mappedData = res
        .map((i: any) => {
          const listItem = i.data;
          const changePercent =
            ((listItem[0].priceClose - listItem[1].priceClose) /
              listItem[1].priceClose) *
            100;
          const todayItem = listItem[0];
          // listItem.splice(0, 1)
          const averageVolume15Days = meanBy(listItem, 'dealVolume');

          const estimatedVolumeChange =
            (todayItem.dealVolume / averageVolume15Days) * 100;
          return {
            symbol: todayItem.symbol,
            changePercent: Number(changePercent.toFixed(1)),
            estimatedVolumeChange: Number(estimatedVolumeChange.toFixed(0)),
            todayVolume: (todayItem.dealVolume / 1000000).toFixed(2),
            averageVolume15Days: (averageVolume15Days / 1000000).toFixed(2),
          };
        })
        .sort((a: any, b: any) => {
          return b.changePercent - a.changePercent;
        });
      return mappedData;
    });
  };

  const fetchList = async () => {
    const res = await StockService.getWatchlist();
    if (res && res.data) {
      setListWatchlists(res.data);
      fetch(res.data, '8633_dau_co_va_BDS').then((res) => setData1(res));
      fetch(res.data, '8781_chung_khoan').then((res) => setData2(res));
      fetch(res.data, 'watching').then((res) => setData3(res));
      fetch(res.data, 'aim_to_buy').then((res) => setData4(res));
      fetch(res.data, '8355_ngan_hang').then((res) => setData5(res));
    }
  };

  const handleReset = async () => {
    const listThanhKhoanVua: any = keyBy(listWatchlists, 'watchlistID')[
      '737544'
    ];
    const res = await axios({
      method: 'PUT',
      url: `https://restv2.fireant.vn/me/watchlists/1140364`,
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
      },
      data: {
        name: 'aim_to_buy',
        symbols: listThanhKhoanVua.symbols,
        userName: 'minhpn.org.ec1@gmail.com',
        watchlistID: 1140364,
      },
    });
    if (res && res.data) {
      fetchList();
      notification.success({ message: 'Success' });
    }
  };

  const handleRemove = async (symbol: string) => {
    const removedData = data4.filter((i: any) => i.symbol !== symbol);
    setData4(removedData);
    const res = await axios({
      method: 'PUT',
      url: `https://restv2.fireant.vn/me/watchlists/1140364`,
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
      },
      data: {
        name: 'aim_to_buy',
        symbols: removedData.map((i: any) => i.symbol),
        userName: 'minhpn.org.ec1@gmail.com',
        watchlistID: 1140364,
      },
    });
    if (res && res.data) {
      fetchList();
      notification.success({ message: 'Success' });
    }
  };

  const handleFilter = () => {
    if (filtered) {
      setFiltered(false);
      setChangePercentMax(0);
      setChangePercentMin(0);
      setEstimatedVolumeChange(0);
    } else {
      setFiltered(true);
      setChangePercentMax(5);
      setChangePercentMin(1);
      setEstimatedVolumeChange(50);
    }
  };

  useEffect(() => {
    fetchList();
    // setInterval(() => {
    //     fetchList()
    // }, 60000)
  }, []);

  const columns = [
    {
      title: 'Symbol',
      sorter: (a: any, b: any) => {
        return a.symbol.localeCompare(b.symbol);
      },
      render: (i: any) => {
        return (
          <div style={{ width: '60px' }}>
            {i.symbol}{' '}
            {editable && (
              <CloseOutlined
                style={{ marginLeft: '2px' }}
                onClick={() => handleRemove(i.symbol)}
              />
            )}{' '}
          </div>
        );
      },
    },
    {
      title: '%change',
      sorter: (a: any, b: any) => {
        return a.changePercent - b.changePercent;
      },
      align: 'right' as 'right',
      render: (data: any) => {
        return data.changePercent;
      },
    },
    {
      title: '%volume',
      sorter: (a: any, b: any) => {
        return a.estimatedVolumeChange - b.estimatedVolumeChange;
      },
      align: 'right' as 'right',
      render: (data: any) => {
        return data.estimatedVolumeChange;
      },
    },
  ];

  const dataSource = filtered
    ? data4.filter(
        (i: any) =>
          changePercentMin &&
          i.changePercent > changePercentMin &&
          changePercentMax &&
          i.changePercent < changePercentMax &&
          estimatedVolumeChange &&
          i.estimatedVolumeChange > estimatedVolumeChange
      )
    : data4;

  const renderWatchList = (name: string, data: any) => {
    return (
      <div style={{ padding: '0 20px', borderRight: '1px solid black' }}>
        <div>{name}</div>
        {data.map((i: any) => {
          let color = 'rgb(204, 170, 0)';
          if (i.changePercent > 0) {
            if (i.changePercent > 6.5) {
              color = 'rgb(255, 0, 255)';
            } else {
              color = 'green';
            }
          }
          if (i.changePercent < 0) {
            if (i.changePercent < -6.5) {
              color = 'rgb(0, 204, 204)';
            } else {
              color = 'red';
            }
          }
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100px',
                color,
              }}
            >
              <div>{i.symbol} </div>
              <div>{i.changePercent}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPotentialBuyTable = () => {
    return (
      <div style={{ margin: '0 20px', display: 'flex' }}>
        <div style={{ width: '300px' }}>
          <Table
            size="small"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <div>
            {confirmReset ? (
              <div style={{ display: 'flex' }}>
                <Button onClick={handleReset}>Sure</Button>
                <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={() => setConfirmReset(true)}> Reset</Button>
            )}
            <Button onClick={() => setEditable(!editable)}>Edit</Button>
          </div>
          <div>
            <Button onClick={handleFilter}>
              Turn {filtered ? 'Off' : 'On'} Filtered
            </Button>
            <div>Change Percent Min: {changePercentMin}</div>
            <div>Change Percent Max: {changePercentMax}</div>
            <div>Volume Change: {estimatedVolumeChange}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ background: 'white', display: 'flex' }}
      className="StockMarketOverview"
    >
      <div style={{ display: 'flex' }}>
        {renderWatchList('bds', data1)}
        {renderWatchList('ck', data2)}
        {renderWatchList('ngan hang', data5)}
        {renderWatchList('watching', data3)}
        {/* {renderPotentialBuyTable()} */}
      </div>
    </div>
  );
}
