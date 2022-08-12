import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import keyBy from 'lodash/keyBy';
import moment from 'moment';
import { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { DATE_FORMAT, DEFAULT_END_TIME_FRAME, DEFAULT_START_TIME_FRAME, LIST_END_TIME_FRAME, LIST_START_TIME_FRAME } from './utils';

const OBJ_START_TIME_FRAME = keyBy(LIST_START_TIME_FRAME, 'value')
const OBJ_END_TIME_FRAME = keyBy(LIST_END_TIME_FRAME, 'value')

const useStyles = makeStyles()(theme => {
    console.log(theme)

    return {
        root: {

        },
        datePicker: {
            maxWidth: "150px"
        },
        button: {
            color: "#14ACFF",
            fontWeight: 600
        }
    }
})

interface IProps {
    handleChangeTime: any;
    handleRefresh: any;
}

export default function EchartsLineChartHeader({ handleChangeTime, handleRefresh }: IProps) {
    const { classes } = useStyles();

    const [startTimeFrame, setStartTimeFrame] = useState(DEFAULT_START_TIME_FRAME.value);
    const [endTimeFrame, setEndTimeFrame] = useState(DEFAULT_END_TIME_FRAME.value);
    const [startDate, setStartDate] = useState<Date | null>(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 3));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState<Date | null>(new Date());
    const [endTime, setEndTime] = useState<Date | null>(new Date());

    useEffect(() => {
        console.log('EchartsLineChartHeader')
        if (!handleChangeTime) return
        let start: any;
        let end: any;

        if (startTimeFrame === "choose_from_calendar") {
            start = moment(startDate).format(DATE_FORMAT)

            if (endTimeFrame === "choose_from_calendar") {
                end = moment(endDate).format(DATE_FORMAT)

            } else {
                const COUNT = OBJ_END_TIME_FRAME[endTimeFrame].countDay
                end = moment().add(COUNT, 'days').format(DATE_FORMAT)
            }

        } else {
            const COUNT = OBJ_START_TIME_FRAME[startTimeFrame].countDay
            start = moment().add(-COUNT, 'days').format(DATE_FORMAT)
            end = moment().format(DATE_FORMAT)
        }

        handleChangeTime({ start, end })
    }, [startTimeFrame, endTimeFrame, startDate, endDate, startTime, endTime])

    return (
        <Box display="flex" justifyContent="space-between">
            <Box display="flex">
                <Box justifyContent="flex-end">
                    <FormControl fullWidth>
                        {/* <InputLabel id="time-frame">{OBJ_START_TIME_FRAME[startTimeFrame].label}</InputLabel> */}
                        <Select
                            // labelId="time-frame"
                            // id="time-frame-select"
                            // variant='standard'
                            value={startTimeFrame}
                            label={OBJ_START_TIME_FRAME[startTimeFrame].label}
                            onChange={(event) => {
                                setStartTimeFrame(event.target.value)
                            }}
                        >
                            {
                                LIST_START_TIME_FRAME.map(i => {
                                    return <MenuItem key={i.value} value={i.value} >{i.label}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
                {
                    startTimeFrame === "choose_from_calendar" &&
                    <>
                        <div>Time start</div>
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <StaticDatePicker
                                onChange={(newValue) => { }}
                                value={'123'}
                                renderInput={(params) => <TextField {...params} />}
                                componentsProps={{
                                    actionBar: {
                                        actions: ['today'],
                                    },
                                } as any}
                            />
                        </LocalizationProvider> */}
                        <Box className={classes.datePicker} ml={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker

                                    renderInput={(props) => <TextField {...props} />}
                                    label="Start date"
                                    value={startDate}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                    }}

                                    componentsProps={{
                                        actionBar: { actions: ['clear', 'today'] },
                                    } as any}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box className={classes.datePicker} ml={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    // label="Start time"
                                    value={startTime}
                                    onChange={(newValue) => {
                                        setStartTime(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Box>
                        <div>Time End</div>
                        <Box ml={2} justifyContent="flex-end">
                            <FormControl fullWidth>
                                {/* <InputLabel id="time-frame">{OBJ_END_TIME_FRAME[endTimeFrame].label}</InputLabel> */}
                                <Select
                                    // labelId="time-frame"
                                    // id="time-frame-select"
                                    // variant='standard'
                                    value={endTimeFrame}
                                    label={OBJ_END_TIME_FRAME[endTimeFrame].label}
                                    onChange={(event) => {
                                        setEndTimeFrame(event.target.value)
                                    }}
                                >
                                    {
                                        LIST_END_TIME_FRAME.map(i => {
                                            return <MenuItem key={i.value} value={i.value} >{i.label}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        {
                            endTimeFrame === "choose_from_calendar" &&
                            <>
                                <Box className={classes.datePicker} ml={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            renderInput={(props) => <TextField {...props} />}
                                            label="End date"
                                            value={endDate}
                                            onChange={(newValue) => {
                                                setEndDate(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box className={classes.datePicker} ml={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            renderInput={(props) => <TextField {...props} />}
                                            // label="End time"
                                            value={endTime}
                                            onChange={(newValue) => {
                                                setEndTime(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </>
                        }
                    </>
                }
            </Box>
            <Button className={classes.button} onClick={handleRefresh}>REFRESH</Button>
        </Box>
    );
}
