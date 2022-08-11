import Box from '@mui/material/Box';
import { ECharts, getInstanceByDom, init } from 'echarts';
import get from 'lodash/get';
import { useEffect, useRef } from "react";
import EchartsLineChartHeader from './EchartsLineChartHeader';
import EchartsSettings from './EchartsLineChartSettings';
import { DEFAULT_OPTION } from './utils';

interface Props {
    data?: any;
    handleLoadMore?: any;
    option?: any;
    handleChangeTime?: any;
    handleRefresh?: any;
    handleExport?: any;
    handleCellClick?: any;
    handleAdd?: any;
    handleChangeColor?: any;
    handleToggleRightAxis?: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function EchartsLineChart({
    data,
    option = DEFAULT_OPTION,
    handleChangeTime,
    handleLoadMore,
    handleRefresh,
    handleExport,
    handleCellClick,
    handleAdd,
    handleChangeColor,
    handleToggleRightAxis
}: Props) {

    console.log('EchartsLineChart')

    const chartRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    const handleChangeSettings = (newOptions: any) => {
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(newOptions)
        }
    }

    useEffect(() => {
        // Initialize chart
        let chart: ECharts | undefined;
        if (chartRef.current !== null) {
            chart = init(chartRef.current);
            option && chart?.setOption(option)

            // Binding event https://echarts.apache.org/en/api.html#echartsInstance.on

            // chart.on('click', function (params: any) {
            //     console.log('click', params)
            // })

            // chart.on('highlight', function (params: any) {
            //     console.log('highlight')
            // })

            // chart.on('downplay', function (params: any) {
            //     console.log('downplay')
            // })

            // chart.on('selectchanged', function (params: any) {
            //     console.log('selectchanged')
            // })

            // chart.on('legendselectchanged', function (params: any) {
            //     console.log('legendselectchanged')
            // })

            // chart.on('legendselected', function (params: any) {
            //     console.log('legendselected')
            // })

            // chart.on('legendunselected', function (params: any) {
            //     console.log('legendunselected')
            // })

            // chart.on('legendselectall', function (params: any) {
            //     console.log('legendselectall')
            // })

            // chart.on('legendinverseselect', function (params: any) {
            //     console.log('legendinverseselect')
            // })

            // chart.on('legendscroll', function (params: any) {
            //     console.log('legendscroll')
            // })

            chart.on('datazoom', function (params: any) {
                console.log('datazoom', params)
                if (params.start === 0 || get(params, 'batch[0].start') === 0) {
                    console.log('loadmore')
                    if (btnRef.current) {
                        btnRef.current.click()
                    }
                }
            })

            // chart.on('datarangeselected', function (params: any) {
            //     console.log('datarangeselected')
            // })

            // chart.on('timelinechanged', function (params: any) {
            //     console.log('timelinechanged')
            // })

            // chart.on('timelineplaychanged', function (params: any) {
            //     console.log('timelineplaychanged')
            // })

            // chart.on('restore', function (params: any) {
            //     console.log('restore')
            // })
            // chart.on('dataviewchanged', function (params: any) {
            //     console.log('dataviewchanged')
            // })

            // chart.on('magictypechanged', function (params: any) {
            //     console.log('magictypechanged')
            // })

            // chart.on('geoselectchanged', function (params: any) {
            //     console.log('geoselectchanged')
            // })
            // chart.on('geoselected', function (params: any) {
            //     console.log('geoselected')
            // })

            // chart.on('geounselected', function (params: any) {
            //     console.log('geounselected')
            // })

            // chart.on('axisareaselected', function (params: any) {
            //     console.log('axisareaselected')
            // })

            // chart.on('brush', function (params: any) {
            //     console.log('brush')
            // })

            // chart.on('brushEnd', function (params: any) {
            //     console.log('brushEnd')
            // })

            // chart.on('brushselected', function (params: any) {
            //     console.log('brushselected')
            // })

            // chart.on('globalcursortaken', function (params: any) {
            //     console.log('globalcursortaken')
            // })

            // chart.on('rendered', function (params: any) {
            // console.log('rendered')
            // })

            // chart.on('finished', function (params: any) {
            //     console.log('finished')
            // })
        }

        // Add chart resize listener
        function resizeChart() {
            chart?.resize();
        }
        window.addEventListener('resize', resizeChart)

        // Return cleanup function
        return () => {
            chart?.dispose()
            window.removeEventListener('resize', resizeChart)
        }
    }, [])

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            const old: any = chart?.getOption()
            const settings: any = {}
            if (option?.xAxis?.length < old?.xAxis?.length) {
                settings.notMerge = true
                // settings.replaceMerge = 'xAxis'
            }
            console.log('updated chart', chart, old, option)

            if (old?.dataZoom && old?.dataZoom.length && old?.series?.length && option?.series?.length) {
                // Get datazoom type === "inside"
                console.log(197, old?.dataZoom, option?.dataZoom)
                let oldDataZoom = old?.dataZoom.filter((i: any) => i.type === "inside")[0]
                if (oldDataZoom) {

                    // Get length of new added data, list old data, list new data
                    const addedDataLength = option.series[0].data.length - old.series[0].data.length
                    const oldDataLength = oldDataZoom.endValue / (oldDataZoom.end / 100)
                    const newDataLength = oldDataLength + addedDataLength

                    // Check add to bottom or add to top

                    const addedValueLength = option.addPosition === "bottom" ? addedDataLength : 0

                    // Calculate new start and end of insider zoom
                    oldDataZoom.start = 100 * (oldDataZoom.startValue + addedValueLength) / newDataLength
                    oldDataZoom.end = 100 * (oldDataZoom.endValue + addedValueLength) / newDataLength

                    // Calculate start and end of slider zoom
                    let oldDataZoom2 = old?.dataZoom.filter((i: any) => i.type === "slider")[0]
                    if (oldDataZoom2) {
                        oldDataZoom2.start = 100 * (oldDataZoom2.startValue + addedValueLength) / newDataLength
                        oldDataZoom2.end = 100 * (oldDataZoom2.endValue + addedValueLength) / newDataLength
                    }



                    const newOption = { ...option, dataZoom: old?.dataZoom }
                    option && chart?.setOption(newOption, settings)
                    return
                }
            }
            option && chart?.setOption(option, settings)
        }
    }, [option]) // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    return <div style={{ position: "relative", padding: "4rem", border: "1px solid black" }}>
        <EchartsLineChartHeader
            handleChangeTime={handleChangeTime}
            handleRefresh={() => {
                if (chartRef.current !== null) {
                    const chart = getInstanceByDom(chartRef.current);
                    chart?.clear()
                }
                handleRefresh()
            }} />

        <div ref={btnRef} onClick={handleLoadMore} style={{ display: "none" }} />
        <div ref={chartRef} style={{
            width: '100%',
            height: '500px',
            padding: "10px",
            borderRadius: "10px",
        }} />

        <Box>
            <EchartsSettings
                data={data}
                chartRef={chartRef}
                handleExport={handleExport}
                handleChangeSettings={handleChangeSettings}
                handleAdd={handleAdd}
                handleCellClick={handleCellClick}
                handleChangeColor={handleChangeColor}
                handleToggleRightAxis={handleToggleRightAxis}
            />
        </Box>
    </div >
}
