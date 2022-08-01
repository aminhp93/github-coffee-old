import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
// method echarts
import { getInstanceByDom, init } from 'echarts';

// type echarts
import {
    ECharts, SetOptionOpts
} from 'echarts';
import get from 'lodash/get';
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { DARK_MODE_OPTION, LIGHT_MODE_OPTION } from './utils';


interface Props {
    cbLoadMore?: any;
    loading?: boolean;
    option?: any;
    settings?: SetOptionOpts;
}

export default function EchartsLineChart({
    cbLoadMore,
    loading,
    option,
    settings,
}: Props) {
    const [darkMode, setDarkMode] = useState('auto' as any)
    const chartRef = useRef<HTMLDivElement>(null);
    let chart: any;
    // console.log('EchartsLineChart', option)

    const handleSwitchDarkMode = (e: any) => {
        console.log(e.target.checked)
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(e.target.checked ? DARK_MODE_OPTION : LIGHT_MODE_OPTION)
        }
    }

    const handleSwitchDataZoom = (e: any) => {
        console.log(e.target.checked)
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(e.target.checked ? {
                dataZoom: [
                    {
                        type: 'slider',
                        startValue: '2015-01-01',
                    },
                    {
                        type: 'inside',
                        startValue: '2015-01-01',
                    }
                ]
            } : {
                dataZoom: [{
                    type: 'inside',
                    startValue: '2015-01-01',
                }]

            })
        }
    }

    const handleSwitchAxisPointer = (e: any) => {
        console.log(e.target.checked)
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(e.target.checked ? {
                tooltip: {
                    show: true,
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                }
            } : {
                tooltip: {
                    show: false
                }
            })
        }
    }

    const handleSwitchStepLine = (e: any) => {
        console.log(e.target.checked)
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            chart?.setOption(e.target.checked ? {
                series: {
                    step: "start"
                }
            } : {
                series: {
                    step: false
                }
            })
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
                    cbLoadMore && cbLoadMore()
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

            console.log(old, option)
            if (old?.dataZoom && old?.series?.length && option?.series?.data) {
                let oldDataZoom = old?.dataZoom[0]

                // Get length of new added data, list old data, list new data
                const addedDataLength = option.series.data.length - old.series[0].data.length
                const oldDataLength = oldDataZoom.endValue / (oldDataZoom.end / 100)
                const newDataLength = oldDataLength + addedDataLength

                // Calculate new start and end of insider zoom
                oldDataZoom.start = 100 * (oldDataZoom.startValue) / newDataLength
                oldDataZoom.end = 100 * (oldDataZoom.endValue) / newDataLength

                // Calculate start and end of slider zoom
                let oldDataZoom2 = old?.dataZoom[1]
                oldDataZoom2.start = 100 * (oldDataZoom2.startValue) / newDataLength
                oldDataZoom2.end = 100 * (oldDataZoom2.endValue) / newDataLength

                const newOption = { ...option, dataZoom: old?.dataZoom }
                option && chart?.setOption(newOption)
            } else {
                option && chart?.setOption(option)
            }


        }
    }, [option, settings]) // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            const chart = getInstanceByDom(chartRef.current);
            loading === true ? chart?.showLoading() : chart?.hideLoading()
        }
    }, [loading])

    // console.log('render', darkMode, chart, option)

    return <div >
        <div ref={chartRef} style={{
            width: '100%',
            height: '500px',
            padding: "10px",
            borderRadius: "10px",
        }} />
        <div>
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchDarkMode} />} label="Dark mode" />
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchDataZoom} />} label="Data zoom slider" />
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchAxisPointer} />} label="Axis pointer" />
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchStepLine} />} label="Step line" />
            </FormGroup>

        </div>
        <Button onClick={() => {
            console.log('click')
            setDarkMode(uuidv4())
        }}>test render</Button>
    </div >
}
