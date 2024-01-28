/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import dayjs from 'dayjs';
import { Select, Button, notification, Tabs } from 'antd';
import CustomEcharts from 'components/customEcharts/CustomEcharts';
import { EChartsOption } from 'echarts';
import StockService from '../service';
import { groupBy, uniqBy } from 'lodash';
import useStockStore from '../Stock.store';
import { Watchlist } from '../Stock.types';
import type { TabsProps } from 'antd';

const DEFAULT_OPTION: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      data: [],
    },
  ],
};

const items: TabsProps['items'] = [
  {
    key: 'post',
    label: `Post`,
  },
  {
    key: 'news',
    label: `News`,
  },
];

const StockTrending = () => {
  const watchlist = useStockStore((state) => state.watchlist);
  const selectedWatchlist = useStockStore((state) => state.selectedWatchlist);
  const setSelectedWatchlist = useStockStore(
    (state) => state.setSelectedWatchlist
  );

  const [filter, setFilter] = useState('day');
  const [option, setOption] = useState<any>(DEFAULT_OPTION);
  const [tab, setTab] = useState('post');

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setFilter(value);
  };

  const handleChangeWl = (value: string) => {
    console.log(`selected wl ${value}`);
    if (!watchlist) return;
    setSelectedWatchlist(watchlist[Number(value)]);
  };

  const handleChangeTab = (value: string) => {
    console.log(`selected tab ${value}`);
    setTab(value);
    setOption(null);
  };

  const handleGetData = async () => {
    if (!selectedWatchlist) return;

    for (let i = 0; i < selectedWatchlist.symbols.length; i++) {
      const listPromise = [];

      for (let j = 0; j < 50; j++) {
        let type = -1;
        if (tab === 'post') {
          type = 0;
        } else if (tab === 'news') {
          type = 1;
        }
        if (type !== -1) {
          listPromise.push(
            StockService.getStockPost({
              type,
              offset: j * 20,
              limit: 20,
              symbol: selectedWatchlist.symbols[i],
            })
          );
        }
      }
      // wait 5s
      await new Promise((resolve) => setTimeout(resolve, 100));
      await Promise.all(listPromise)
        .then((res: any) => {
          console.log(res);
          const flattenData = uniqBy(
            res.map((i: any) => i.data).flat(),
            (item: any) => item.postID
          );

          const newSeriesData = getSeries(flattenData, filter);
          setOption((prevOption: any) => {
            let newOption: any;
            if (prevOption) {
              const newSeries: any = prevOption.series || [];
              newSeries.push({
                name: selectedWatchlist.symbols[i],
                type: 'line',
                data: newSeriesData,
              });
              newOption = {
                ...prevOption,
                series: newSeries,
              };
            } else {
              const newSeries: any = [];
              console.log(newSeriesData);
              newSeries.push({
                name: selectedWatchlist.symbols[i],
                type: 'line',
                data: newSeriesData,
              });
              newOption = {
                ...DEFAULT_OPTION,
                series: newSeries,
              };
            }
            return newOption;
          });
        })
        .catch((err: any) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        });
    }
  };

  const getSeries = (data: any, filter: any) => {
    const result: [string, number][] = [];
    let format = '';
    if (filter === 'day') {
      format = 'YYYY-MM-DD';
    } else if (filter === 'week') {
      format = 'YYYY-WW';
    } else if (filter === 'month') {
      format = 'YYYY-MM';
    }

    if (!format) return [];
    const newData = data.map((i: any) => {
      i.mappedDate = dayjs(i.date).format(format);
      return i;
    });

    const groupData = groupBy(newData, 'mappedDate');
    for (let i = -13; i < 1; i++) {
      const date = dayjs().add(i, 'day').format(format);
      result.push([date, groupData[date]?.length || 0]);
    }
    return result;
  };
  console.log({ option });

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <Tabs
          defaultActiveKey="post"
          items={items}
          onChange={handleChangeTab}
        />
        <Button onClick={handleGetData}>Get Data</Button>
        {watchlist && (
          <Select
            value={selectedWatchlist ? selectedWatchlist?.name : null}
            style={{ width: 200 }}
            onChange={handleChangeWl}
            options={Object.values(watchlist).map((i: Watchlist) => ({
              value: i.watchlistID,
              label: i.name,
            }))}
          />
        )}
      </div>
      <Select
        value={filter}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'day', label: 'day' },
          { value: 'week', label: 'week' },
          { value: 'month', label: 'month' },
        ]}
      />
      <div style={{ overflow: 'auto', flex: 1 }}>
        {option && <CustomEcharts option={option} />}
      </div>
    </div>
  );
};

export default StockTrending;
