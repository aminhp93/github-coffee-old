import type { EChartsOption, DataZoomComponentOption } from 'echarts';
import { ECharts, getInstanceByDom, init } from 'echarts';
import { memo, useEffect, useRef } from 'react';
import { withSize } from 'react-sizeme';

type Props = {
  size?: {
    width: number;
    height: number;
  };
  option?: EChartsOption;
  handleZoom?: (
    params: DataZoomComponentOption,
    oldOption: EChartsOption
  ) => void;
};

const CustomEcharts = ({ size, option, handleZoom }: Props) => {
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
      const old = chart?.getOption();
      const newOption = { ...option };
      if (old?.dataZoom) {
        newOption.dataZoom = old?.dataZoom;
      }

      option &&
        chart &&
        chart.setOption &&
        chart.setOption(newOption, { notMerge: true });
    }
  }, [option]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);

      chart &&
        chart.on('datazoom', function (params: unknown) {
          handleZoom &&
            handleZoom(
              params as DataZoomComponentOption,
              chart?.getOption() as EChartsOption
            );
        });
    }
  }, [handleZoom]);

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
