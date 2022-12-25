import Echarts from 'components/Echarts';

interface Props {
  dates: string[];
  prices: number[];
  volumes: number[];
}

const BackTestChart = ({ dates, prices, volumes }: Props) => {
  //   const dates = [
  //     '2016-03-29',
  //     '2016-03-30',
  //     '2016-03-31',
  //     '2016-04-01',
  //     '2016-04-04',
  //   ];

  //   Order [open, close, lowest, highest, volume];
  //   const prices = [
  //     [17512.58, 17633.11, 17434.27, 17642.81, 86160000],
  //     [17652.36, 17716.66, 17652.36, 17790.11, 79330000],
  //     [17716.05, 17685.09, 17669.72, 17755.7, 102600000],
  //     [17661.74, 17792.75, 17568.02, 17811.48, 104890000],
  //     [17799.39, 17737, 17710.67, 17806.38, 85230000],
  //   ];

  //   const volumes = [86160000, 79330000, 102600000, 104890000, 85230000];

  const colorList = [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3',
  ];

  const xAxis = [
    {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#777' } },
      // axisLabel: {
      //   formatter: function (value: any) {
      //     return format.formatTime('MM-dd', value);
      //   },
      // },
      min: 'dataMin',
      max: 'dataMax',
      show: false,
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
      show: false,
      axisPointer: {
        type: 'shadow',
        label: { show: false },
        triggerTooltip: true,
        handle: {
          show: true,
          margin: 30,
          color: '#B80C00',
        },
      },
    },
  ];
  const yAxis = [
    {
      scale: true,
      splitNumber: 2,
      axisLine: { lineStyle: { color: '#777' } },
      splitLine: { show: true },
      axisTick: { show: false },
      axisLabel: {
        inside: true,
        show: false,
        formatter: '{value}\n',
      },
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ];
  const series = [
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
    {
      type: 'candlestick',
      name: '日K',
      data: prices,
      itemStyle: {
        color: '#ef232a',
        color0: '#14b143',
        borderColor: '#ef232a',
        borderColor0: '#14b143',
      },
      emphasis: {
        itemStyle: {
          color: 'black',
          color0: '#444',
          borderColor: 'black',
          borderColor0: '#444',
        },
      },
    },
  ];
  const option = {
    color: colorList,
    xAxis,
    yAxis,
    series,
    grid: [
      {
        left: 20,
        right: 20,
        top: 0,
        height: 30,
      },
      {
        left: 20,
        right: 20,
        height: 16,
        top: 30,
      },
    ],
  };
  return (
    <div style={{ overflow: 'auto', width: '150px', height: '50px' }}>
      <Echarts option={option} />
    </div>
  );
};

export default BackTestChart;
