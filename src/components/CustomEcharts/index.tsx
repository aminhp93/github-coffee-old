import type { EChartsOption } from 'echarts';
import { ECharts, getInstanceByDom, init } from 'echarts';
import { memo, useEffect, useRef } from 'react';
import { withSize } from 'react-sizeme';

export interface EchartsProps {
  size?: {
    width: number;
    height: number;
  };
  option?: EChartsOption;
}

const CustomEcharts = ({ size, option }: EchartsProps): React.ReactElement => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null && chartRef.current.clientHeight) {
      chart = init(chartRef.current);
    }

    // Return cleanup function
    return () => {
      chart?.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.resize();
    }
  }, [size]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);

      // console.log("updated chart", chart, old, option);
      option && chart && chart.setOption && chart.setOption(option);
    }
  }, [option]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        minWidth: '100px',
        minHeight: '100px',
        height: '100%',
        borderRadius: '10px',
      }}
    />
  );
};

export default memo(
  withSize({ monitorHeight: true, monitorWidth: true })(CustomEcharts)
);
