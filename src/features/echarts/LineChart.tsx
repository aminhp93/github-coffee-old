import {useEffect, useRef} from 'react';
import * as echarts from 'echarts';

export interface Props {}

export default function LineChart(props: Props) {
  const myChart = useRef(null as any);
  const base = +new Date(2014, 9, 3);
  const oneDay = 24 * 3600 * 1000;
  const date: any = [];
  const data = [Math.random() * 150];
  let now: any = new Date(base);

  const addData = (shift?: any) => {
    now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
    date.push(now);
    data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);
    if (shift) {
      date.shift();
      data.shift();
    }
    now = new Date(+new Date(now) + oneDay);
  }

  const option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      triggerEvent: true
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value'
    },
    series: [
      {
        name: 'xx',
        type: 'line',
        smooth: true,
        symbol: 'none',
        stack: 'a',
        areaStyle: {
          normal: {}
        },
        data: data
      }
    ]
  };

  

  useEffect(() => {
    for (var i = 1; i < 100; i++) {
      addData();
    }
    const chart = echarts.init(myChart.current);
    console.log(chart)
    chart.setOption(option)


    // Show/hide the legend only trigger legendselectchanged event
    chart.on('mouseover', {seriesName: 'xx'}, function () {
      // When the graphic elements of the data item with name 'xx' in the series with index 1 mouse overed, this method is called.
      console.log('asdfsadf')
    });

    chart.on('click', {seriesName: 'xx324'}, function () {
      // When the graphic elements of the data item with name 'xx' in the series with index 1 mouse overed, this method is called.
      console.log('asdfsadf12312')
    });


    chart.on('click', 'series', function () {
      // When the graphic elements of the data item with name 'xx' in the series with index 1 mouse overed, this method is called.
      console.log('asdfsadf12312')
    });

   
    // setInterval(function () {
    //   // console.log(data)
    //   addData(true);
    //   chart.setOption({
    //     xAxis: {
    //       data: date
    //     },
    //     series: [
    //       {
    //         name: '成交',
    //         data: data
    //       }
    //     ]
    //   });
    // }, 500);
  }, [])

  return<div
      ref={myChart}
      style={{
        width: '100%',
        height: '100%',
      }}
    ></div>
}




