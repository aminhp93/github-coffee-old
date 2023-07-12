import { useState } from 'react';
import dayjs from 'dayjs';
import { Select, Button, notification } from 'antd';
import CustomEcharts from 'components/customEcharts/CustomEcharts';
import { EChartsOption } from 'echarts';
import StockService from '../service';
import { groupBy, uniqBy } from 'lodash';
import useStockStore from '../Stock.store';

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

const StockTrending = () => {
  const watchlist = useStockStore((state) => state.watchlist);

  const [filter, setFilter] = useState('day');
  const [option, setOption] = useState<EChartsOption>(DEFAULT_OPTION);
  const [data, setData] = useState<any>([]);

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setFilter(value);
  };

  const handleGetData = () => {
    const thanh_khoan_vua_Wl = watchlist ? watchlist[737544] : null;
    if (!thanh_khoan_vua_Wl) return;

    const listPromise = [];

    thanh_khoan_vua_Wl.symbols = ['VPB', 'STB', 'TCB', 'MBB'];

    for (let i = 0; i < thanh_khoan_vua_Wl.symbols.length; i++) {
      for (let j = 0; j < 10; j++) {
        listPromise.push(
          StockService.getStockPost({
            type: 0,
            offset: j * 20,
            limit: 20,
            symbol: thanh_khoan_vua_Wl.symbols[i],
          })
        );
      }
    }

    Promise.all(listPromise)
      .then((res: any) => {
        console.log(res);
        const flattenData = uniqBy(
          res.map((i: any) => i.data).flat(),
          (item: any) => item.postID
        );
        console.log(flattenData);

        const newSeries = getSeries(flattenData, filter);
        setData(flattenData);
        const newOption: any = {
          ...option,
          series: [
            {
              name: 'Email',
              type: 'line',
              data: newSeries.reverse(),
            },
          ],
        };

        setOption(newOption);
      })
      .catch((err: any) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
  };

  const getSeries = (data: any, filter: any) => {
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
    return Object.keys(groupData).map((i) => {
      return [i, groupData[i].length];
    });
  };

  console.log(option);

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
