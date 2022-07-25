// import { useRef, useEffect } from 'react';
import LineChart from './LineChart';
// import * as echarts from 'echarts';
// import request from 'request';
// import shuffle from 'lodash/shuffle';

// const resizeObserver = new ResizeObserver((entries) => {
//   entries.map(({ target }: any) => {
//     const instance = echarts.getInstanceByDom(target);
//     if (instance) {
//       instance.resize();
//     }
//   });
// });

// const dataZoomChart = (obama_budget_2012: any) => {
//   return {
//     tooltip: {
//       trigger: 'item',
//     },
//     legend: {
//       data: ['Growth', 'Budget 2011', 'Budget 2012'],
//       itemGap: 5,
//     },
//     grid: {
//       top: '12%',
//       left: '1%',
//       right: '10%',
//       containLabel: true,
//     },
//     xAxis: [
//       {
//         type: 'category',
//         data: obama_budget_2012.names,
//       },
//     ],
//     yAxis: [
//       {
//         type: 'value',
//         name: 'Budget (million USD)',
//         axisLabel: {
//           formatter: function (a: any) {
//             a = +a;
//             return isFinite(a) ? echarts.format.addCommas(+a / 1000) : '';
//           },
//         },
//       },
//     ],
//     dataZoom: [
//       {
//         type: 'slider',
//         show: true,
//         start: 94,
//         end: 100,
//         handleSize: 8,
//       },
//       {
//         type: 'inside',
//         start: 94,
//         end: 100,
//       },
//       {
//         type: 'slider',
//         show: true,
//         yAxisIndex: 0,
//         filterMode: 'empty',
//         width: 12,
//         height: '70%',
//         handleSize: 8,
//         showDataShadow: false,
//         left: '93%',
//       },
//     ],
//     series: [
//       {
//         name: 'Budget 2011',
//         type: 'line',
//         smooth: true,
//         data: obama_budget_2012.budget2011List,
//       },
//       {
//         name: 'Budget 2012',
//         type: 'line',
//         smooth: true,
//         data: obama_budget_2012.budget2012List,
//       },
//     ],
//   };
// };

export default function CustomEcharts() {
  return (
    <div>
      {/* <div style={{ height: "500px", width: "500px"}}>
        <Chart  resizeObserver={resizeObserver} />
      </div> */}
      <div style={{ height: '500px', width: '500px' }}>
        <LineChart />
      </div>
    </div>
  );
}

// const SAMPLE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// const SAMPLE_NAME = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// function Chart({ options, resizeObserver }: any) {
//   const myChart = useRef(null as any);

//   const fetch = async () => {
//     try {
//       const chart = echarts.init(myChart.current);
//       const res = await request({
//         url: 'https://echarts.apache.org/examples/data/asset/data/obama_budget_proposal_2012.list.json',
//         method: 'GET',
//       });
//       const data: any = {
//         budget2011List: shuffle(SAMPLE),
//         budget2012List: shuffle(SAMPLE),
//         delta: shuffle(SAMPLE),
//         names: shuffle(SAMPLE_NAME),
//       };

//       setInterval(() => {
//         data.budget2011List = data.budget2011List.concat(shuffle(SAMPLE));
//         data.budget2012List = data.budget2012List.concat(shuffle(SAMPLE));
//         data.delta = data.delta.concat(shuffle(SAMPLE));
//         data.names = data.names.concat(shuffle(SAMPLE_NAME));

//         const option: any = dataZoomChart(data);
//         chart.setOption(option);
//       }, 5000);
//     } catch (e) {
//       //
//     }
//   };

//   // useEffect(() => {
//   //   const chart = echarts.init(myChart.current);
//   //   console.log(options);
//   //   chart.setOption(options);
//   //   if (resizeObserver) resizeObserver.observe(myChart.current);
//   // }, [options, resizeObserver]);

//   useEffect(() => {
//     fetch();
//   });

//   return (
//     <div
//       ref={myChart}
//       style={{
//         width: '100%',
//         height: '100%',
//       }}
//     ></div>
//   );
// }
