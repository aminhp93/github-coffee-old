/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomEcharts from 'components/customEcharts/CustomEcharts';
import {
  color,
  dataZoom,
  grid,
  upColor,
  downColor,
  visualMap,
  yAxis,
  toolbox,
  brush,
  axisPointer,
  tooltip,
} from './StockChart.constants';
import { StockChartData } from '../Stock.types';
import { EChartsOption } from 'echarts';

/*
  const dates = [
    '2016-03-29',
    '2016-03-30',
    '2016-03-31',
    '2016-04-01',
    '2016-04-04',
  ];

  Order [open, close, lowest, highest, volume];
  const prices = [
    [17512.58, 17633.11, 17434.27, 17642.81, 86160000],
    [17652.36, 17716.66, 17652.36, 17790.11, 79330000],
    [17716.05, 17685.09, 17669.72, 17755.7, 102600000],
    [17661.74, 17792.75, 17568.02, 17811.48, 104890000],
    [17799.39, 17737, 17710.67, 17806.38, 85230000],
  ];

  const volumes = [86160000, 79330000, 102600000, 104890000, 85230000];
*/

type Props = {
  data: StockChartData;
  handleZoom?: any;
  config?: any;
};

const StockChart = ({ data, handleZoom, config }: Props) => {
  const { dates, prices, volumes, seriesMarkPoint, markLine } = data;

  const xAxis: any = [
    {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#777' } },
      axisLabel: {
        formatter: function (value: any) {
          // return format.formatTime('MM-dd', value);
          return value;
        },
      },

      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisPointer: {
        show: true,
      },
    },
    {
      type: 'category',
      gridIndex: 1,
      data: dates,
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#777' } },
      min: 'dataMin',
      max: 'dataMax',
      // axisPointer: {
      //   type: 'shadow',
      //   label: { show: false },
      //   triggerTooltip: true,
      //   handle: {
      //     show: true,
      //     margin: 30,
      //     color: '#B80C00',
      //   },
      // },
    },
  ];

  const series: any = [
    {
      type: 'candlestick',
      name: '日K',
      data: prices,
      itemStyle: {
        color0: downColor,
        color: upColor,
        borderColor0: downColor,
        borderColor: upColor,
      },
      emphasis: {
        itemStyle: {
          color: 'black',
          color0: '#444',
          borderColor: 'black',
          borderColor0: '#444',
        },
      },
      markPoint: seriesMarkPoint,
      markLine,
    },
    {
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        color: '#7fbe9e',
      },
      emphasis: {
        itemStyle: {
          color: '#140',
        },
      },
      data: volumes,
    },
  ];

  const option: EChartsOption = {
    animation: false,
    color,
    xAxis,
    yAxis,
    series,
    grid,
    visualMap,
    tooltip,
    dataZoom: config?.dataZoom || dataZoom,
    toolbox,
    brush,
    axisPointer,
  };

  return (
    <div style={{ overflow: 'auto', width: '100%', height: '100%' }}>
      <CustomEcharts option={option} handleZoom={handleZoom} />
    </div>
  );
};

export default StockChart;
