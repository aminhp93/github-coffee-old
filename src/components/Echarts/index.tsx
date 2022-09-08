import { ECharts, getInstanceByDom, init } from 'echarts';
import get from 'lodash/get';
import { useEffect, useRef } from 'react';

interface Props {
  option?: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function EchartsLineChart({ option }: Props) {
  console.log('EchartsLineChart');

  const chartRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
      option && chart?.setOption(option);

      chart.on('datazoom', function (params: any) {
        console.log('datazoom', params);
        if (params.start === 0 || get(params, 'batch[0].start') === 0) {
          console.log('loadmore');
          if (btnRef.current) {
            btnRef.current.click();
          }
        }
      });
    }

    // Add chart resize listener
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      const old: any = chart?.getOption();
      const settings: any = {};
      if (option?.xAxis?.length < old?.xAxis?.length) {
        settings.notMerge = true;
        // settings.replaceMerge = 'xAxis'
      }
      // console.log('updated chart', chart, old, option);

      option && chart?.setOption(option, settings);
    }
  }, [option]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '10px',
      }}
    />
  );
}
