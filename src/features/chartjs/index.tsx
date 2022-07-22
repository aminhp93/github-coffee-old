import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import faker from 'faker';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button } from 'antd';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(zoomPlugin);

const labels = ['M-0', 'M-1', 'M-2'];
const data1 = labels.map(() =>  faker.datatype.number({ min: -1000, max: 1000 }))
const data2 = labels.map(() =>  faker.datatype.number({ min: -1000, max: 1000 }))

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: data1,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: data2,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ]
};

export interface Props {}

export default function CustomChartJS(props: Props) {
  
  const myChart = useRef(null as any);
  const [listNote, setListNote] = useState<string[]>([]) 

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: (params: any) => {
          console.log('click', params)
        }
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
      zoom: {
        // pan: {
        //   enabled: true,
        //   mode: 'x',
        //   modifierKey: 'ctrl',
        // },
        pan: {
          enabled: true,
          mode: 'xy',
          threshold: 5,
          onPan: () => {
            const newList = [...listNote]
            newList.unshift('on pan')
            setListNote(newList)
            console.log('on pan')
          },
          onPanComplete: () => {
            const newList = [...listNote]
            newList.unshift('on onPanComplete')
            setListNote(newList)
            console.log('on onPanComplete')
          },
          onPanRejected: () => {
            const newList = [...listNote]
            newList.unshift('on onPanRejected')
            setListNote(newList)
            console.log('on onPanRejected')
          },
          onPanStart: () => {
            const newList = [...listNote]
            newList.unshift('on onPanStart')
            setListNote(newList)
            console.log('on onPanStart')
          }
        },
        zoom: {
          // drag: {
          //   enabled: true
          // },
          // mode: 'x',
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
          onZoom: () => {
            const newList = [...listNote]
            newList.unshift('on onZoom')
            setListNote(newList)
            console.log('on onZoom')
          },
          onZoomComplete: () => {
            const newList = [...listNote]
            newList.unshift('on onZoomComplete')
            setListNote(newList)
            console.log('on onZoomComplete')
          },
          onZoomRejected: () => {
            const newList = [...listNote]
            newList.unshift('on onZoomRejected')
            setListNote(newList)
            console.log('on onZoomRejected')
          },
          onZoomStart: () => {
            const newList = [...listNote]
            newList.unshift('on onZoomStart')
            setListNote(newList)
            console.log('on onZoomStart')
          }
        },
      }
    },
    
  };
  console.log(149)

  useEffect(() => {
    setInterval(() => {
      const chart = myChart.current;
      labels.push(`M-${labels.length}`)
      data1.push(faker.datatype.number({ min: -1000, max: 1000 }))
      data2.push(faker.datatype.number({ min: -1000, max: 1000 }))
      chart.data.datasets[0].data = data1
      chart.data.datasets[1].data = data2
      console.log(chart.data.datasets)
      chart.update();
    }, 2000); 
  }, [])

  return <div>
    <Button onClick={() => { myChart.current.resetZoom()}}>Reset</Button>
    <Line options={options} data={data} ref={myChart}  />
    <div style={{ height: "200px", overflow: "auto"}}>{listNote.map((i: string) => {
      return <div>{i}</div>
    })}</div>
  </div>;
}
