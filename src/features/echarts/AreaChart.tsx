import { ReactHTMLElement, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const options = {
  title: {
    text: 'ECharts Getting Started Example',
  },
  tooltip: {},
  xAxis: {
    data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks'],
  },
  yAxis: {},
  series: [
    {
      name: 'sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

export interface Props {}

export default function LineChart(props: Props) {
  const myChart = useRef(null as any);

  useEffect(() => {
    // initialize the echarts instance

    const chart = echarts.init(myChart.current);
    // Draw the chart
    chart.setOption(options);
  }, []);

  return <div ref={myChart} style={{ width: '100%', height: '100%' }}></div>;
}
