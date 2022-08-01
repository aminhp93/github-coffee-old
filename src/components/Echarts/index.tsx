import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import EchartsLineChart from './EchartsLineChart';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import {
  createFakeFullData,
  DEFAULT_OPTION,
  getDay,
  getRows,
  LIST_CHART_TYPE,
  LIST_TIME_FRAME,
  MULTIPLE_AXIS_OPTION,
  SERIES_OPTION,
  XAXIS_OPTION,
} from './utils';

const ROOT_PATH = 'https://echarts.apache.org/examples';
let FULL_DATA: any = [];
let CURRENT_DATA: any = [];

const OBJ_TIME_FRAME = keyBy(LIST_TIME_FRAME, 'value');
const OBJ_CHART_TYPE = keyBy(LIST_CHART_TYPE, 'value');

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      // 👇️ ts-nocheck disables type checking for entire file
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-nocheck

      // 👇️ ts-ignore ignores any ts errors on the next line
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Echarts(): React.ReactElement {
  const [timeFrame, setTimeFrame] = useState(LIST_TIME_FRAME[0].value);
  const [chartType, setChartType] = useState(LIST_CHART_TYPE[0].value);
  const [option, setOption] = useState(null as any);
  const [rows1, setRows1] = useState([] as any);
  const [rows2, setRows2] = useState([] as any);
  const [delay, setDelay] = useState(5000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      handleLoadMore();
    },
    isRunning ? delay : null
  );

  const columns: any = [
    { field: 'object_name', headerName: 'OBJECT NAME', width: 130 },
    { field: 'description', headerName: 'DESCRIPTION', width: 130 },
    { field: 'average', headerName: 'AVERAGE', width: 130 },
    { field: 'min', headerName: 'MIN', width: 130 },
    { field: 'max', headerName: 'MAX', width: 130 },
    { field: 'unit', headerName: 'UNIT', width: 130 },
    { field: 'hide_all', headerName: 'HIDE ALL', width: 130 },
    { field: 'remove_all', headerName: 'REMOVE ALL', width: 130 },
    { field: 'tag', headerName: 'TAG', width: 130 },
  ];

  const handleChange = (event: SelectChangeEvent) => {
    const filter_data = FULL_DATA.filter(
      (i: any) => moment(i[0]).format('ddd') === getDay(event.target.value)
    );
    const newOption = getNewOption(filter_data);
    setTimeFrame(event.target.value as string);
    setOption(newOption);
  };

  const handleChangeChartType = (event: SelectChangeEvent) => {
    setChartType(event.target.value as string);
  };

  const getNewOption = (newData: any) => {
    return {
      ...DEFAULT_OPTION,
      xAxis: {
        ...XAXIS_OPTION.xAxis,
        data: newData.map(function (item: string[]) {
          // return moment(item[0]).format('MMMM Do YYYY')
          return item[0];
        }),
      },
      dataZoom: [
        {
          type: 'inside',
        },

        {
          type: 'slider',
        },
      ],
      series: {
        ...SERIES_OPTION.series,
        data: newData.map(function (item: number[]) {
          return item[1];
        }),
      },
    };
  };

  const handleLoadMore = () => {
    CURRENT_DATA = CURRENT_DATA.concat(
      FULL_DATA.splice(FULL_DATA.length - 100, 100)
    );
    const newOption = getNewOption(CURRENT_DATA);
    setOption(newOption);
  };

  const handleDelayChange = (e: any) => {
    setDelay(Number(e.target.value));
  };

  const handleIsRunningChange = (e: any) => {
    setIsRunning(e.target.checked);
  };

  useEffect(() => {
    (async function () {
      const res = await axios({
        url: `${ROOT_PATH}/data/asset/data/aqi-beijing.json`,
        method: 'GET',
      });

      // FULL_DATA = res.data
      FULL_DATA = createFakeFullData();
      console.log(FULL_DATA);
      CURRENT_DATA = CURRENT_DATA.concat(
        FULL_DATA.splice(FULL_DATA.length - 100, 100)
      );
      const newOption = getNewOption(CURRENT_DATA);
      setRows1(getRows([1]));
      setRows2(getRows([1, 1, 1]));
      setOption(newOption);
    })();
  }, []);

  return (
    <Container style={{ maxWidth: 1800 }}>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={8} lg={6} alignItems="center">
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 200 }} justifyContent="flex-end">
              <FormControl fullWidth>
                <InputLabel id="time-frame">
                  {OBJ_TIME_FRAME[timeFrame].label}
                </InputLabel>
                <Select
                  labelId="time-frame"
                  id="time-frame-select"
                  value={timeFrame}
                  label={OBJ_TIME_FRAME[timeFrame].label}
                  onChange={handleChange}
                >
                  {LIST_TIME_FRAME.map((i) => {
                    return <MenuItem value={i.value}>{i.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: 200 }} ml={2} justifyContent="flex-end">
              <FormControl fullWidth>
                <InputLabel id="chart-type">
                  {OBJ_CHART_TYPE[chartType].label}
                </InputLabel>
                <Select
                  labelId="chart-type"
                  id="chart-type-select"
                  value={chartType}
                  label={OBJ_CHART_TYPE[chartType].label}
                  onChange={handleChangeChartType}
                >
                  {LIST_CHART_TYPE.map((i) => {
                    return <MenuItem value={i.value}>{i.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box ml={2} sx={{ display: 'flex' }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRunning}
                      onChange={handleIsRunningChange}
                    />
                  }
                  label="Running"
                />
              </FormGroup>
              <Input value={delay} onChange={handleDelayChange} />
            </Box>
          </Box>
          <Box mt={2}>
            <EchartsLineChart option={option} cbLoadMore={handleLoadMore} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4} lg={6} alignItems="center">
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 200 }} justifyContent="flex-end">
              <FormControl fullWidth>
                <InputLabel id="time-frame">
                  {OBJ_TIME_FRAME[timeFrame].label}
                </InputLabel>
                <Select
                  labelId="time-frame"
                  id="time-frame-select"
                  value={timeFrame}
                  label={OBJ_TIME_FRAME[timeFrame].label}
                >
                  {LIST_TIME_FRAME.map((i) => {
                    return <MenuItem value={i.value}>{i.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: 200 }} ml={2} justifyContent="flex-end">
              <FormControl fullWidth>
                <InputLabel id="chart-type">
                  {OBJ_CHART_TYPE[chartType].label}
                </InputLabel>
                <Select
                  labelId="chart-type"
                  id="chart-type-select"
                  value={chartType}
                  label={OBJ_CHART_TYPE[chartType].label}
                >
                  {LIST_CHART_TYPE.map((i) => {
                    return <MenuItem value={i.value}>{i.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box mt={2}>
            <EchartsLineChart option={MULTIPLE_AXIS_OPTION} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
