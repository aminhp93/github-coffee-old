import { useState, useEffect } from 'react';
import { keyBy, meanBy } from 'lodash';
import { notification, Table, Button } from 'antd';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons';
import Echarts from 'components/Echarts';
import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CustomTradingViewUrls } from 'request';
import request from 'request';
import { StockService } from 'services';
import moment from 'moment';

const DATE_FORMAT = 'HH:mm';

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
  const [changePercentMin, setChangePercentMin] = useState(1);
  const [changePercentMax, setChangePercentMax] = useState(5);
  const [estimatedVolumeChange, setEstimatedVolumeChange] = useState(50);

  const columnsMuiTable: GridColDef[] = [
    {
      field: 'symbol',
      width: 100,
      renderCell: (data: any) => {
        return (
          <div style={{ width: '60px' }}>
            {data.row.symbol}{' '}
            {editable && (
              <CloseOutlined
                style={{ marginLeft: '2px' }}
                onClick={() => handleRemove(data.row.symbol)}
              />
            )}{' '}
          </div>
        );
      },
    },
    {
      field: '%volume',
      width: 100,
      renderCell: (data: any) => {
        return <div>{data.row.estimatedVolumeChange}</div>;
      },
    },
    {
      field: '%change',
      width: 100,
      renderCell: (data: any) => {
        return <div>{data.row.changePercent}</div>;
      },
    },

    {
      field: 'chart',
      width: 500,
      renderCell: (data: any) => {
        const history = data.row.history;
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                backgroundColor: '#ccc',
                borderColor: '#aaa',
                borderWidth: 1,
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                color: '#222',
              },
            },
          },
          grid: {
            top: 6,
            left: 80,
            right: 40,
            bottom: 20,
          },
          xAxis: {
            axisLabel: {
              formatter: (value: any) => {
                moment.locale('en');
                return `{hour|${moment(parseInt(value)).format('HH:mm')}}`;
              },
              rich: {
                hour: {
                  color: '#1E294B',
                  opacity: 0.6,
                },
              },
            },
            alignTicks: true,
            axisPointer: {
              label: {
                formatter: (data: any) => {
                  return moment(parseInt(data.value)).format(DATE_FORMAT);
                },
              },
            },
            data: (history?.t || []).map((i: any) => i * 1000).slice(0, 1000),
          },
          yAxis: {},
          series: [
            {
              data: (history?.v || []).slice(0, 1000),
              type: 'line',
            },
          ],
        };

        return (
          <div style={{ overflow: 'auto', width: '100%' }}>
            <Echarts option={option} />
          </div>
        );
      },
    },
  ];

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

  const getDataHistoryUrl = async (symbol: string) => {
    const startDate = moment();
    startDate.set({
      hour: 9,
      minute: 0,
    });
    const endDate = moment();
    endDate.set({
      hour: 15,
      minute: 0,
    });
    const start = String(startDate.format('X'));
    const end = String(endDate.format('X'));

    const res = await request({
      method: 'GET',
      url: CustomTradingViewUrls.getDataHistoryUrl(symbol, '1', start, end),
    });

    return {
      symbol,
      res: res.data,
    };
  };

  const fetchData4 = async (data: any) => {
    console.log(
      data,
      changePercentMin,
      changePercentMax,
      estimatedVolumeChange
    );
    const filteredData = data.filter(
      (i: any) =>
        i.changePercent > changePercentMin &&
        i.changePercent < changePercentMax &&
        i.estimatedVolumeChange > estimatedVolumeChange
    );
    console.log(filteredData);
    if (!filtered) return;
    const listPromises: any = [];
    filteredData.forEach((i: any) => {
      listPromises.push(getDataHistoryUrl(i.symbol));
    });

    return Promise.all(listPromises).then((res) => {
      const keyByRes = keyBy(res, 'symbol');
      const newData = filteredData.map((i: any) => {
        i.history = keyByRes[i.symbol].res;
        return i;
      });
      setData4(newData);
    });
  };

  const fetchList = async () => {
    const res = await StockService.getWatchlist();
    if (res && res.data) {
      setListWatchlists(res.data);
      fetch(res.data, '8633_dau_co_va_BDS').then((res) => setData1(res));
      fetch(res.data, '8781_chung_khoan').then((res) => setData2(res));
      fetch(res.data, 'watching').then((res) => setData3(res));
      fetch(res.data, 'thanh_khoan_vua').then((res) => {
        setData4(res);
        fetchData4(res);
      });
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
    setInterval(() => {
      fetchList();
    }, 1000 * 30);
  }, []);

  const dataSource = filtered
    ? data4.filter(
        (i: any) =>
          i.changePercent > changePercentMin &&
          i.changePercent < changePercentMax &&
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
      <div style={{ margin: '0 20px', display: 'flex', flex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 850, width: '100%' }}>
            <DataGrid
              rows={dataSource.map((i: any) => {
                i.id = i.symbol;
                return i;
              })}
              columns={columnsMuiTable}
              pageSize={6}
              rowHeight={120}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </div>
        </div>

        <div style={{ marginLeft: '20px' }}>
          {/* <div>
            {confirmReset ? (
              <div style={{ display: 'flex' }}>
                <Button onClick={handleReset}>Sure</Button>
                <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={() => setConfirmReset(true)}> Reset</Button>
            )}
            <Button onClick={() => setEditable(!editable)}>Edit</Button>
          </div> */}
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
      <div style={{ display: 'flex', width: '100%' }}>
        {renderWatchList('bds', data1)}
        {renderWatchList('ck', data2)}
        {renderWatchList('ngan hang', data5)}
        {renderWatchList('watching', data3)}
        {renderPotentialBuyTable()}
      </div>
    </div>
  );
}
