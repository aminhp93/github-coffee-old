import React, { useEffect, useRef } from 'react';
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

export const options: any = {
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
          console.log('on pan')
        },
        onPanComplete: () => {
          console.log('on onPanComplete')
        },
        onPanRejected: () => {
          console.log('on onPanRejected')
        },
        onPanStart: () => {
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
          console.log('on onZoom')
        },
        onZoomComplete: () => {
          console.log('on onZoomComplete')
        },
        onZoomRejected: () => {
          console.log('on onZoomRejected')
        },
        onZoomStart: () => {
          console.log('on onZoomStart')
        }
      },
    }
  },
  
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
export interface Props {}

export default function CustomChartJS(props: Props) {

  const myChart = useRef(null as any);

  useEffect(() => {
    setInterval(() => {
      const chart = myChart.current;
      chart.data.datasets[0].data = labels.map(() => faker.datatype.number({ min: -1000, max: 1000 }))
      chart.data.datasets[1].data = labels.map(() => faker.datatype.number({ min: -1000, max: 1000 }))
      console.log(chart.data.datasets)
      chart.update();
    }, 2000); 
  }, [])

  return <div>
    <Button onClick={() => { myChart.current.resetZoom()}}>Reset</Button>
    <Line options={options} data={data} ref={myChart}  />;
  </div>;
}
