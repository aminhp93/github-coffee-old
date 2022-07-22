import {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import moment from 'moment'
import {Button} from 'antd'
import random from 'lodash/random'

export interface Props {}



export default function LineChart(props: Props) {
  const [listLogs, setListLogs] = useState<string[]>([])

  const myChart = useRef(null as any);
  const base = +new Date(2014, 9, 3);
  const oneDay = 24 * 3600 * 1000;
  const date: any = [];
  const data = [Math.random() * 150];
  const data2 = [Math.random() * 250];
  
  let now: any = new Date(base);

  const addData = (shift?: any) => {
    now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
    date.push(now);
    data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);
    if (shift) {
      date.shift();
      data.shift();
    }

    data2.push((Math.random() - 0.4) * 10 + data2[data2.length - 1]);
    if (shift) {
      date.shift();
      data2.shift();
    }
    now = new Date(+new Date(now) + oneDay);
  }


  const option = {
    title: {
      text: 'title text',
      subtext: 'subtext'
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['stack', 'tiled'] },
        saveAsImage: { show: true }
      }
    },
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {},
    series: [
      {
        name: 'xx',
        type: 'line',
        smooth: true,
        data: data,
        triggerLineEvent: true
      },
      {
        name: 'yy',
        type: 'line',
        smooth: true,
        data: data2,
        triggerLineEvent: true
      },
    

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
  };


  const handleCbClick = (e: any) => {
    // When the graphic elements of the data item with name 'xx' in the series with index 1 mouse overed, this method is called.
    console.log('click seriesName')
    setListLogs((old) => {
      const newListLogs = [...old]
      newListLogs.unshift('click seriesName')
      return newListLogs
    })
  }

  useEffect(() => {
    for (let i = 1; i < 100; i++) {
      addData();
    }
    console.log()
    const chart = echarts.init(myChart.current);
    console.log(chart)
    chart.setOption(option)

    chart.on('click', function(params) {
      handleCbClick(params)
    });

    setInterval(function () {
      addData(true);
      chart.setOption({
        xAxis: {
          data: date
        },
        series: [
          {
            name: 'xx',
            type: 'line',
            smooth: true,
            data: data,
            triggerLineEvent: true
          },
          {
            name: 'yy',
            type: 'line',
            smooth: true,
            data: data2,
            triggerLineEvent: true
          },
        ]
      });
    }, 500);
  }, [])

  return<div
      
    >
      <div ref={myChart}
      style={{
        width: '500px',
        height: '500px',
      }}/>
      <div>{listLogs.map((i, index) => {
        return <div key={index}>{i}</div>
      })}
      </div>
     
    </div>
}




