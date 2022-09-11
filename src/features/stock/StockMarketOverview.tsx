import { CheckCircleOutlined } from '@ant-design/icons';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Spin } from 'antd';
import Echarts from 'components/Echarts';
import { keyBy, meanBy } from 'lodash';
import moment from 'moment';
import { ChangeEvent, useEffect, useState } from 'react';
import request, { CustomTradingViewUrls } from 'request';
import { StockService } from 'services';
import { useInterval } from 'usehooks-ts';
import {
  checkMarketOpen,
  FULL_TIME_FORMAT,
  getStartAndEndTime,
  NUMBER_UNIT_REDUCED,
  TIME_FORMAT,
  TIME_FRAME,
} from './utils';

const useStyles = makeStyles({
  root: {
    background: 'white',
  },
  potentialBuyTable: {
    margin: '0 16px',
  },
});

export default function StockMarketOverview() {
  const classes = useStyles();

  const [data4, setData4] = useState([] as any);
  const [filtered, setFiltered] = useState(true);
  const [changePercentMin, setChangePercentMin] = useState(1);
  const [changePercentMax, setChangePercentMax] = useState(5);
  const [estimatedVolumeChange, setEstimatedVolumeChange] = useState(50);
  const [delay, setDelay] = useState<number>(1000 * 10);
  const [isPlaying, setPlaying] = useState<boolean>(checkMarketOpen());
  const [loading, setLoading] = useState(false);

  const { start, end } = getStartAndEndTime();

  const columnsMuiTable: GridColDef[] = [
    {
      field: 'symbol',
      width: 100,
      headerName: 'Symbol',
    },
    {
      field: 'estimatedVolumeChange',
      headerName: '% volume',
      width: 100,
    },
    {
      field: 'changePercent',
      headerName: '% change',
      width: 100,
    },

    {
      headerName: 'Estimated volume',
      field: 'chart',
      width: 500,
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

  const getDataHistoryUrl = async (symbol: string) => {
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
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await StockService.getWatchlist();
      if (res && res.data) {
        fetch(res.data, 'thanh_khoan_vua').then((res) => {
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
                const dataSource = filtered
                  ? newData.filter(
                      (i: any) =>
                        i.changePercent > changePercentMin &&
                        i.changePercent < changePercentMax &&
                        i.estimatedVolumeChange > estimatedVolumeChange
                    )
                  : newData;
                setData4(dataSource);
              })
              .catch((e) => {
                setLoading(false);
              });
          };
          fetchData4(res);
        });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setFiltered(!filtered);
  };

  useEffect(() => {
    fetchList();
  }, [filtered]);

  useInterval(fetchList, isPlaying ? delay : null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(event.target.value));
  };

  const renderPotentialBuyTable = () => {
    return (
      <Box className={`${classes.potentialBuyTable} flex flex-1`}>
        <Box className="flex-1">
          <DataGrid
            rows={data4.map((i: any) => {
              i.id = i.symbol;
              return i;
            })}
            columns={columnsMuiTable}
            pageSize={5}
            rowHeight={120}
            rowsPerPageOptions={[5]}
            // checkboxSelection
          />
        </Box>
        <Box style={{ marginLeft: '20px' }}>
          <div>
            <Box>
              {loading ? 'Loading' : 'Done loading'}{' '}
              {loading ? <Spin /> : <CheckCircleOutlined />}
            </Box>
            <Box>
              <Box>Start {start.format(FULL_TIME_FORMAT)}</Box>
              <Box>End {end.format(FULL_TIME_FORMAT)}</Box>
              <Box>Timeframe {TIME_FRAME}</Box>
            </Box>
            <Divider />
            <Button variant="outlined" onClick={handleFilter}>
              Turn {filtered ? 'Off' : 'On'} Filtered
            </Button>
            <div>Change Percent Min: {changePercentMin}</div>
            <div>Change Percent Max: {changePercentMax}</div>
            <div>Volume Change: {estimatedVolumeChange}</div>
            <Divider />

            <Box component="form" noValidate autoComplete="off">
              <Button variant="outlined" onClick={() => setPlaying(!isPlaying)}>
                {isPlaying ? 'Stop Interval' : 'Start Interval'}
              </Button>
              <TextField
                sx={{ width: '80px', marginLeft: '8px' }}
                id="filled-basic"
                label="delay"
                variant="filled"
                value={delay}
                onChange={handleChange}
              />
            </Box>
            <Box>
              {checkMarketOpen() ? 'Market Open' : 'Market Close'}
              <IconButton
                aria-label="brightness"
                color={checkMarketOpen() ? 'success' : 'default'}
              >
                <Brightness1Icon />
              </IconButton>
            </Box>
          </div>
        </Box>
      </Box>
    );
  };

  return (
    <Box className={`${classes.root} width-100 flex height-100`}>
      {renderPotentialBuyTable()}
    </Box>
  );
}
