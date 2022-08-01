import * as echarts from 'echarts';
import { useEffect, useRef } from "react";

import { MULTIPLE_AXIS_OPTION } from './utils';

export default function EchartsMultipleAxisChart() {
    const myChart = useRef(null as any);


    useEffect(() => {
        const chart = echarts.init(myChart.current);
        chart.setOption(MULTIPLE_AXIS_OPTION)

        window.addEventListener('resize', function () {
            chart.resize();
        })
    }, [])

    return <div ref={myChart} style={{
        width: '100%',
        height: '500px',
    }}></div >
}