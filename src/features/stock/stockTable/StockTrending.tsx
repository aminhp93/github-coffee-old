import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Select, Button, notification } from 'antd';
import CustomEcharts from 'components/customEcharts/CustomEcharts';
import { EChartsOption } from 'echarts';
import StockService from '../service';
import { groupBy } from 'lodash';
import useStockStore from '../Stock.store';

const option: EChartsOption = {
  title: {
    text: 'Stacked Line',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

const StockTrending = () => {
  const watchlist = useStockStore((state) => state.watchlist);

  const [filter, setFilter] = useState('day');
  const [data, setData] = useState<any>([]);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setFilter(value);
  };

  const handleGetData = () => {
    const thanh_khoan_vua_Wl = watchlist ? watchlist[737544] : null;
    if (!thanh_khoan_vua_Wl) return;

    const listPromise = [];

    for (let i = 0; i < thanh_khoan_vua_Wl.symbols.length; i++) {
      listPromise.push(
        StockService.getStockPost({
          type: 0,
          offset: 0,
          limit: 20,
          symbol: thanh_khoan_vua_Wl.symbols[i],
        })
      );
    }

    Promise.all(listPromise)
      .then((res: any) => {
        console.log(res);
        const flattenData = res.map((i: any) => i.data).flat();
        setData(flattenData);
      })
      .catch((err: any) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
  };

  const filterData = useMemo(() => {
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
    console.log(newData);

    return groupBy(newData, 'mappedDate');
  }, [data, filter]);

  console.log({ filterData });

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <Button onClick={handleGetData}>Get Data</Button>
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
        <CustomEcharts option={option} />
      </div>
    </div>
  );
};

export default StockTrending;
