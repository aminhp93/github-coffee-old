import { ECharts, getInstanceByDom, init } from 'echarts';
import { memo, useEffect, useRef } from 'react';

interface Props {
  option?: any;
  handleHighlight?: any;
}

function EchartsLineChart({ option, handleHighlight }: Props) {
  console.log('EchartsLineChart');

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
      // chart &&
      //   chart.on('highlight', function (params: any) {
      //     console.log('highlight', params);
      //     handleHighlight && handleHighlight(params);
      //   });
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
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart &&
        chart.on('highlight', function (params: any) {
          console.log('highlight', params);
          handleHighlight && handleHighlight(params);
        });
    }
  }, [handleHighlight]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      option && chart?.setOption(option);
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

export default memo(EchartsLineChart);
