import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useEffect, useState } from "react";
import EchartsLineChart from './EchartsLineChart';
import { addFakeData, addFakeDataBetween, COLORS, DEFAULT_OPTION, getNewOption, MULTIPLE_AXIS_DATA, useInterval, waitApi } from './utils';

export default function Echarts(): React.ReactElement {
    const [option, setOption] = useState(DEFAULT_OPTION as any);
    const [data, setData] = useState([] as any)
    const [delay, setDelay] = useState(5000);
    const [isRunning, setIsRunning] = useState(false);

    console.log('Echarts', data, option)

    const handleChangeColor = (obj: any, color: string) => {
        const newData = [...data]
        const index = newData.findIndex(i => i.id === obj.id)
        if (index > -1) {
            newData[index].lineStyle = {
                color
            }
            console.log('update color', newData, color)
            setData(newData)
            setOption(getNewOption(newData, option))
        }
    }

    useInterval(() => {
        handleLoadMore()
    }, isRunning ? delay : null);

    const handleChangeTime = (newTime: any) => {
        console.log(newTime)
        const newData = [{ id: 1 }, { id: 2 }, { id: 3 }].map((i: any, index) => {
            const data = addFakeDataBetween(newTime.start, newTime.end)
            i.name = `Name ${index}`;
            i.offset = 20 * index;
            i.color = COLORS[index];
            i.seriesData = data.map((j: any) => j[1]);
            i.xAxisData = data.map((j: any) => j[0]);
            return i;
        })

        const newOption = getNewOption(newData, { ...option, addPosition: "" })
        setData(newData)
        setOption(newOption)
    };

    const handleLoadMore = async () => {
        await waitApi()
        const newData = [...data]
        newData.map(i => {
            const ADDED_DATA = addFakeData(i.xAxisData[0], -7)
            i.seriesData = (ADDED_DATA.map((j: any) => j[1]).concat(i.seriesData))
            i.xAxisData = (ADDED_DATA.map((j: any) => j[0])).concat(i.xAxisData)
            return i
        })
        const newOption = getNewOption(newData, { ...option, addPosition: "bottom" })
        setData(newData)
        setOption(newOption)
    }

    const handleAddMore = async () => {
        await waitApi()
        const newData = [...data]
        newData.map(i => {
            const ADDED_DATA = addFakeData(i.xAxisData[i.xAxisData.length - 1], 1)
            i.seriesData = i.seriesData.concat(ADDED_DATA.map((j: any) => j[1]))
            i.xAxisData = i.xAxisData.concat(ADDED_DATA.map((j: any) => j[0]))
            return i
        })
        const newOption = getNewOption(newData, { ...option, addPosition: "top" })
        setData(newData)
        setOption(newOption)
    }

    const handleDelayChange = (e: any) => {
        setDelay(Number(e.target.value));
    }

    const handleIsRunningChange = (e: any) => {
        setIsRunning(e.target.checked);
    }

    const handleExport = () => {
        const blob = new Blob([data]);
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = `test_export_${new Date().getTime()}.csv`;
        link.click();
    }

    const handleAdd = (addedData: any) => {
        if (data.filter((i: any) => i.id === addedData).length > 0) {
            return
        }
        let item
        if (addedData === 1) {
            item = MULTIPLE_AXIS_DATA[0]
        } else if (addedData === 2) {
            item = MULTIPLE_AXIS_DATA[1]
        } else if (addedData === 3) {
            item = MULTIPLE_AXIS_DATA[2]
        }
        const newData = [...data]
        newData.push(item)
        setData(newData)
        setOption(getNewOption(newData, option))
    }

    const handleCellClick = (e: any) => {
        if (e.field === 'remove') {
            let newData = [...data];
            newData = newData.filter(i => i.id !== e.id)
            setOption(getNewOption(newData, option))
            setData(newData)
        }
    }

    const handleToggleRightAxis = (e: any, obj: any) => {
        let newData = [...data];
        newData.map(i => {
            if (i.id === obj.id) {
                if (e.target.checked) {
                    i.yAxisIndex = 1
                    i.position = "right"
                } else {
                    i.yAxisIndex = 0
                    i.position = "left"
                }
            }
            return i
        })
        setOption(getNewOption(newData, option))
        setData(newData)
    }

    useEffect(() => {
        const newData = [...data]
        newData.push(MULTIPLE_AXIS_DATA[0])
        newData.push(MULTIPLE_AXIS_DATA[1])
        setData(newData)
        setOption(getNewOption(newData, option))
    }, [])

    return <Container style={{ maxWidth: 1800 }}>
        <Grid container spacing={2} mt={2} >
            <Grid item xs={12} md={12} lg={12} alignItems="center">
                <Box sx={{ display: 'flex' }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={isRunning} onChange={handleIsRunningChange} />} label="Running" />
                    </FormGroup>
                    <Input value={delay} onChange={handleDelayChange} />
                    <Button onClick={handleLoadMore}>Load previous</Button>
                    <Button onClick={handleAddMore}>Add more</Button>
                </Box>
                <Box mt={2}>
                    <EchartsLineChart
                        data={data}
                        option={option}
                        handleLoadMore={handleLoadMore}
                        handleChangeTime={handleChangeTime}
                        handleRefresh={() => {
                            // CURRENT_DATA = []
                            // fetchData()
                        }}
                        handleExport={handleExport}
                        handleAdd={handleAdd}
                        handleCellClick={handleCellClick}
                        handleChangeColor={handleChangeColor}
                        handleToggleRightAxis={handleToggleRightAxis}
                    />
                </Box>
            </Grid>
        </Grid>
    </Container>
}