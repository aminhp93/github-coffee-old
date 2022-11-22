import { Button, Divider, Dropdown, Input, Menu, Spin, Table } from 'antd';
import Echarts from 'components/Echarts';
import request, { CustomTradingViewUrls } from 'libs/request';
import { StockService } from 'libs/services';
import { keyBy, meanBy } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  checkMarketOpen,
  DELAY_TIME,
  FULL_TIME_FORMAT,
  getStartAndEndTime,
  NUMBER_UNIT_REDUCED,
  TIME_FORMAT,
  TIME_FRAME,
} from './utils';

import {
  CheckCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useInterval } from 'usehooks-ts';

const { TextArea } = Input;

export default function StockMarketOverview() {
  const [data4, setData4] = useState([] as any);
  const [filtered, setFiltered] = useState(true);
  const [changePercentMin] = useState(1);
  const [changePercentMax] = useState(5);
  const [estimatedVolumeChange] = useState(0);
  const [delay, setDelay] = useState<number>(DELAY_TIME);
  const [isPlaying, setPlaying] = useState<boolean>(checkMarketOpen());
  const [loading, setLoading] = useState(false);
  const [listWatchlist, setListWatchlist] = useState([]);
  const [currentWatchlist, setCurrentWatchlist] = useState('');
  const [visibleSidebar, setVisibleSidebar] = useState(true);
  const { start, end } = getStartAndEndTime();

  const columns = [
    {
      key: 'symbol',
      title: 'Symbol',
    },
    {
      key: 'estimatedVolumeChange',
      title: '% volume',
    },
    {
      key: 'changePercent',
      title: '% change',
    },

    {
      title: 'Estimated volume',
      key: 'chart',
      renderCell: (data: any) => {
        const history = data.row.history;
        const listTime = (history?.t || []).map((i: any) => i * 1000);
        let temp = 0;
        let result = 0;
        const listTotalVolume = (history.v || []).map((i: any) => {
          result = temp + i;
          temp = result;
          return result;
        });

        const estimatedVolume = listTotalVolume.map((i: any, index: number) => {
          const date = listTime[index];
          const diffMinute =
            moment(date).diff(
              moment(parseInt(start.format('X')) * 1000),
              'minutes'
            ) + 1;
          return Number(
            ((i * 255) / diffMinute / NUMBER_UNIT_REDUCED).toFixed(0)
          );
        });

        const listAverageVolume15Days = estimatedVolume.map(
          (i: any) => data.row.averageVolume15Days
        );

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
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
                  return moment(parseInt(data.value)).format(TIME_FORMAT);
                },
              },
            },
            data: listTime,
          },
          yAxis: {},
          series: [
            {
              data: estimatedVolume,
              type: 'line',
              showSymbol: false,
            },
            {
              type: 'line',
              data: listAverageVolume15Days,
              showSymbol: false,
            },
          ],
        };
        console.log(option);
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
    setLoading(true);
    return Promise.all(listPromises)
      .then((res) => {
        setLoading(false);
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
              todayVolume: Number(
                (todayItem.dealVolume / NUMBER_UNIT_REDUCED).toFixed(2)
              ),
              averageVolume15Days: Number(
                (averageVolume15Days / NUMBER_UNIT_REDUCED).toFixed(0)
              ),
            };
          })
          .sort((a: any, b: any) => {
            return b.changePercent - a.changePercent;
          });
        return mappedData;
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const getDataHistoryUrl = React.useCallback(
    async (symbol: string) => {
      const res = await request({
        method: 'GET',
        url: CustomTradingViewUrls.getDataHistoryUrl(
          symbol,
          TIME_FRAME,
          start.format('X'),
          end.format('X')
        ),
      });

      return {
        symbol,
        res: res?.data || [],
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await StockService.getWatchlist();
      setListWatchlist(res.data);
      if (res && res.data && currentWatchlist) {
        fetch(res.data, currentWatchlist).then((res: any) => {
          setLoading(false);

          const fetchData4 = async (data: any) => {
            const listPromises: any = [];
            data.forEach((i: any) => {
              listPromises.push(getDataHistoryUrl(i.symbol));
            });
            setLoading(true);
            return Promise.all(listPromises)
              .then((res) => {
                setLoading(false);
                const keyByRes = keyBy(res, 'symbol');
                const newData = data.map((i: any) => {
                  i.history = keyByRes[i.symbol].res;
                  return i;
                });
                setData4(newData);
              })
              .catch((e) => {
                setLoading(false);
              });
          };

          fetchData4(
            filtered
              ? res.filter(
                  (i: any) =>
                    // i.changePercent > changePercentMin &&
                    // i.changePercent < changePercentMax &&
                    i.estimatedVolumeChange > estimatedVolumeChange
                )
              : res
          );
        });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWatchlist = (event: any) => {
    setCurrentWatchlist(event.target.value as string);
  };

  const handleFilter = () => {
    setFiltered(!filtered);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await StockService.getWatchlist();
        setListWatchlist(res.data);
        if (res && res.data && currentWatchlist) {
          fetch(res.data, currentWatchlist).then((res: any) => {
            setLoading(false);

            const fetchData4 = async (data: any) => {
              const listPromises: any = [];
              data.forEach((i: any) => {
                listPromises.push(getDataHistoryUrl(i.symbol));
              });
              setLoading(true);
              return Promise.all(listPromises)
                .then((res) => {
                  setLoading(false);
                  const keyByRes = keyBy(res, 'symbol');
                  const newData = data.map((i: any) => {
                    i.history = keyByRes[i.symbol].res;
                    return i;
                  });
                  setData4(newData);
                })
                .catch((e) => {
                  setLoading(false);
                });
            };

            fetchData4(
              filtered
                ? res.filter(
                    (i: any) =>
                      // i.changePercent > changePercentMin &&
                      // i.changePercent < changePercentMax &&
                      i.estimatedVolumeChange > estimatedVolumeChange
                  )
                : res
            );
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, currentWatchlist, getDataHistoryUrl]);

  useInterval(fetchList, isPlaying ? delay : null);

  const handleChange = (event: any) => {
    setDelay(Number(event.target.value));
  };

  const renderPotentialBuyTable = () => {
    const menu = (
      <Menu onClick={(e) => handleChangeWatchlist(e)}>
        {listWatchlist.map((i: any, index) => {
          return <Menu.Item key={i.watchlistID}>{i.name}</Menu.Item>;
        })}
      </Menu>
    );

    return (
      <div className={` flex flex-1`} style={{ margin: '0 16px' }}>
        <div className="flex-1" style={{ position: 'relative' }}>
          <Table
            dataSource={data4.map((i: any) => {
              i.id = i.symbol;
              return i;
            })}
            columns={columns}
          />

          <Button
            style={{
              position: 'absolute',
              top: 0,
              right: '-16px',
            }}
            icon={visibleSidebar ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setVisibleSidebar(!visibleSidebar)}
          />
        </div>

        {visibleSidebar && (
          <div style={{ marginLeft: '20px' }}>
            <div>
              <div style={{ minWidth: 120, marginTop: '16px' }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <PlusOutlined />
                </Dropdown>
              </div>
              <div>
                {loading ? 'Loading' : 'Done loading'}{' '}
                {loading ? <Spin /> : <CheckCircleOutlined />}
              </div>
              <div>
                <div>Start {start.format(FULL_TIME_FORMAT)}</div>
                <div>End {end.format(FULL_TIME_FORMAT)}</div>
                <div>Timeframe {TIME_FRAME}</div>
              </div>
              <Divider />
              <Button onClick={handleFilter}>
                Turn {filtered ? 'Off' : 'On'} Filtered
              </Button>
              <div>Change Percent Min: {changePercentMin}</div>
              <div>Change Percent Max: {changePercentMax}</div>
              <div>Volume Change: {estimatedVolumeChange}</div>
              <Divider />

              <div>
                <Button onClick={() => setPlaying(!isPlaying)}>
                  {isPlaying ? 'Stop Interval' : 'Start Interval'}
                </Button>
                <TextArea
                  style={{ width: '80px', marginLeft: '8px' }}
                  value={delay}
                  onChange={handleChange}
                />
              </div>
              <div>{checkMarketOpen() ? 'Market Open' : 'Market Close'}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={` width-100 flex height-100`}
      style={{ background: 'white' }}
    >
      {renderPotentialBuyTable()}
    </div>
  );
}
