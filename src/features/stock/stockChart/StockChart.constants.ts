/* eslint-disable @typescript-eslint/no-explicit-any */

export const color = [
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

export const dataZoom = [
  {
    type: 'inside',
    xAxisIndex: [0, 1],
    start: 50,
    end: 100,
    filterMode: 'none',
  },
  {
    show: true,
    xAxisIndex: [0, 1],
    type: 'slider',
    bottom: 20,
    height: 10,
    start: 50,
    end: 100,
    filterMode: 'none',
  },
  {
    type: 'slider',
    yAxisIndex: 0,
    // filterMode: 'none',
    start: 0,
    end: 60,
    filterMode: 'none',
    bottom: 180,
    width: 10,
    height: '50%',
    showDataShadow: false,
    left: '0%',
  },
];

export const grid = [
  {
    top: 0,
    left: '5%',
    right: '5%',
    bottom: 180,
  },
  {
    left: '5%',
    right: '5%',
    height: 80,
    bottom: 60,
  },
];

export const upColor = '#14b143';
export const downColor = '#ef232a';

export const visualMap = {
  show: false,
  seriesIndex: 1,
  dimension: 2,
  pieces: [
    {
      value: 1,
      color: upColor,
    },
    {
      value: -1,
      color: downColor,
    },
  ],
};

export const yAxis = [
  {
    scale: true,
    // splitNumber: 2,
    axisLine: { lineStyle: { color: '#777' } },
    splitLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      // inside: true,
      // show: false,
      formatter: '{value}\n',
    },
  },
  {
    scale: true,
    gridIndex: 1,
    // splitNumber: 2,
    axisLabel: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
  },
];

export const toolbox: any = {
  feature: {
    brush: {
      type: ['lineX', 'clear'],
    },
  },
};

export const brush: any = {
  xAxisIndex: 'all',
  brushLink: 'all',
  outOfBrush: {
    colorAlpha: 0.1,
  },
};

export const axisPointer: any = {
  link: [
    {
      xAxisIndex: 'all',
    },
  ],
  label: {
    backgroundColor: '#777',
  },
};

export const tooltip: any = {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
  },
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  textStyle: {
    color: '#000',
  },
  position: function (
    pos: number[],
    params: any,
    el: any,
    elRect: any,
    size: { viewSize: number[] }
  ) {
    const obj: any = {
      bottom: 10,
    };
    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 80;
    return obj;
  },
  // extraCssText: 'width: 170px'
};
