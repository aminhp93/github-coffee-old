import { useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import AreaChart from './AreaChart';
import LineChart from './LineChart';
import StackedBarChart from './StackedBarChart';
import BarChart from './BarChart';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react'; // or var ReactECharts = require('echarts-for-react');
import request from 'request';
import shuffle from 'lodash/shuffle'

import React from 'react';



const resizeObserver = new ResizeObserver((entries) => {
  entries.map(({ target }: any) => {
    const instance = echarts.getInstanceByDom(target);
    if (instance) {
      instance.resize();
    }
  });
});

const line = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)',
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [140, 232, 101, 264, 90, 340, 250],
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)',
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 282, 111, 234, 220, 340, 310],
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)',
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 132, 201, 334, 190, 130, 220],
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)',
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 402, 231, 134, 190, 230, 120],
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)',
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 302, 181, 234, 210, 290, 150],
    },
  ],
};

const bars = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(220, 220, 220, 0.8)',
      },
    },
  ],
};

const dataZoomChart = (obama_budget_2012: any) => {
  return {

  
  tooltip: {
    trigger: 'item'
  },
  legend: {
    data: ['Growth', 'Budget 2011', 'Budget 2012'],
    itemGap: 5
  },
  grid: {
    top: '12%',
    left: '1%',
    right: '10%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: obama_budget_2012.names
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Budget (million USD)',
      axisLabel: {
        formatter: function (a: any) {
          a = +a;
          return isFinite(a) ? echarts.format.addCommas(+a / 1000) : '';
        }
      }
    }
  ],
  dataZoom: [
    {
      type: 'slider',
      show: true,
      start: 94,
      end: 100,
      handleSize: 8
    },
    {
      type: 'inside',
      start: 94,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: 0,
      filterMode: 'empty',
      width: 12,
      height: '70%',
      handleSize: 8,
      showDataShadow: false,
      left: '93%'
    }
  ],
  series: [
    {
      name: 'Budget 2011',
      type: 'line',
      smooth: true,
      data: obama_budget_2012.budget2011List
    },
    {
      name: 'Budget 2012',
      type: 'line',
      smooth: true,
      data: obama_budget_2012.budget2012List
    }
  ]
}
}

export default function CustomEcharts() {
  return (
    <div>
      {/* <div style={{ height: "500px", width: "500px"}}>
        <Chart  resizeObserver={resizeObserver} />
      </div> */}
      <div style={{ height: "500px", width: "500px"}}>
        <LineChart/>
      </div>
    </div>
  );
}

const SAMPLE = [
  1,2,3,4,5,6,7,8,9
]

const SAMPLE_NAME = [
  '1','2','3','4','5','6','7','8','9'
]



function Chart({ options, resizeObserver }: any) {
  const myChart = useRef(null as any);



  const fetch = async () => {
   try {
    const chart = echarts.init(myChart.current);
    const res = await request({
      url: "https://echarts.apache.org/examples/data/asset/data/obama_budget_proposal_2012.list.json",
      method: "GET"
    })
    const data:any = {
      budget2011List: shuffle(SAMPLE),
      budget2012List: shuffle(SAMPLE),
      delta: shuffle(SAMPLE),
      names: shuffle(SAMPLE_NAME)

    }

    setInterval(() => {
      data.budget2011List = data.budget2011List.concat(shuffle(SAMPLE))
      data.budget2012List = data.budget2012List.concat(shuffle(SAMPLE))
      data.delta = data.delta.concat(shuffle(SAMPLE))
      data.names = data.names.concat(shuffle(SAMPLE_NAME))

      const option: any = dataZoomChart(data)
      chart.setOption(option)
    }, 5000)

   } catch (e) {
// 
   }
  }

  // useEffect(() => {
  //   const chart = echarts.init(myChart.current);
  //   console.log(options);
  //   chart.setOption(options);
  //   if (resizeObserver) resizeObserver.observe(myChart.current);
  // }, [options, resizeObserver]);

  useEffect(() => {
    fetch()
  })

  return (
    <div
      ref={myChart}
      style={{
        width: '100%',
        height: '100%',
      }}
    ></div>
  );
}
