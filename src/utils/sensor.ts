import LineChartContainer from 'features/sensor/LineChartContainer';
import BarChartContainer from 'features/sensor/BarChartContainer';

export const INTERVAL_TIME_CALL_API = 1000 * 60;

export const FAKE_DATA = JSON.parse(
  '[{"sensorId":1,"sensor":"Temperature","historicalData":[10,20,40,30,15],"value":15,"unit":"°C"},{"sensorId":4,"sensor":"Oxygen","historicalData":[75,105,65,95,90],"value":35,"unit":"%"},{"sensorId":2,"sensor":"Intensity","data":30,"historicalData":[1,3,20,40,50],"value":50,"unit":"g"},{"sensorId":3,"sensor":"Feeding","historicalData":[75,105,65,95,90],"value":35,"unit":"%"}]'
);

export const LIST_CHART = [
  {
    key: 'lineChart',
    value: 'Line chart',
    component: LineChartContainer,
  },
  {
    key: 'barChart',
    value: 'Bar chart',
    component: BarChartContainer,
  },
];

// export function getFromLS(key: string) {
//   let ls: any = {};
//   if (global.localStorage) {
//     try {
//       ls = JSON.parse(global.localStorage.getItem('rgl-7') || '') || {};
//     } catch (e) {
//       /*Ignore*/
//     }
//   }
//   return ls[key];
// }

// export function saveToLS(key: string, value: any) {
//   if (global.localStorage) {
//     global.localStorage.setItem(
//       'rgl-7',
//       JSON.stringify({
//         [key]: value,
//       })
//     );
//   }
// }

export function getFromLS(key: string) {
  let ls: any = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8') || '') || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

export function saveToLS(key: string, value: any) {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
