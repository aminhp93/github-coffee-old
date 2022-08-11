
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { getInstanceByDom } from 'echarts';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from "tss-react/mui";
import ColorPopover from './ColorPopover';
import EchartsLineChartSettingsTable from './EchartsLineChartSettingsTable';
import { getRows } from './utils';


const useStyles = makeStyles()(theme => {
  return {
    root: {

    },
    headerBarContainer: {
      // background: "#14ACFF",
      display: "flex",
      justifyContent: "space-between"
    },
    button: {
      color: "#14ACFF",
      fontWeight: 600
    }
  }
})


export interface IEchartsSettingsProps {
  data: any;
  chartRef: any;
  handleExport: any;
  handleChangeSettings: any;
  handleAdd: any;
  handleCellClick: any;
  handleChangeColor: any;
  handleToggleRightAxis: any;
}

export default function EchartsSettings({
  data,
  chartRef,
  handleExport,
  handleChangeSettings,
  handleAdd,
  handleCellClick,
  handleChangeColor,
  handleToggleRightAxis
}: IEchartsSettingsProps) {
  // const [darkMode, setDarkMode] = useState(option && option.darkMode === "auto" ? true : false)
  const { classes } = useStyles();

  const [isAutoScale, setIsAutoScale] = useState(true)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [rows, setRows] = useState([] as any);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (chartRef.current && getInstanceByDom(chartRef.current)) {
      const chart = getInstanceByDom(chartRef.current);
      setTimeout(() => {
        if (getRows(chart?.getOption()?.series)) {
          setRows(getRows(chart?.getOption()?.series))
        }
      }, 0)
    }
  }, [data])


  const columns: any = [
    {
      field: 'object_name',
      headerName: 'OBJECT NAME',
      minwidth: 200,
      flex: 1,
      renderCell: (data: any) => {
        return <Box display="flex">
          <ColorPopover color={data?.row?.color} cb={(color: string) => handleChangeColor(data, color)} />
          <Box>{data.row.object_name}</Box>
        </Box>
      }
    },
    { field: 'description', headerName: 'DESCRIPTION' },
    { field: 'average', headerName: 'AVERAGE' },
    { field: 'min', headerName: 'MIN' },
    { field: 'max', headerName: 'MAX' },
    { field: 'unit', headerName: 'UNIT' },
    {
      field: 'toggle_right_axis',
      headerName: 'toggle_right_axis',
      renderCell: (data: any) => {
        return <Box display="flex">
          <Checkbox onClick={(e) => handleToggleRightAxis(e, data)} />
        </Box>
      }
    },
    { field: 'hide', headerName: 'HIDE' },
    { field: 'remove', headerName: 'REMOVE' },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchAutoScale = (e: any) => {
    setIsAutoScale(e.target.checked)
    if (!e.target.checked) {
      setMin(100)
      setMax(200)
    }

    const newOption = e.target.checked ? {
      yAxis: {
        scale: true,
        min: null,
        max: null
      }
    } : {
      yAxis: {
        scale: false,
        min: 100,
        max: 200
      }
    }
    handleChangeSettings(newOption)
  }

  // const handleSwitchDarkMode = (e: any) => {
  //   setDarkMode(!darkMode)
  //   const newOption = e.target.checked ? DARK_MODE_OPTION : LIGHT_MODE_OPTION
  //   handleChangeSettings(newOption)
  // }

  const handleSwitchDataZoom = (e: any) => {
    const newOption = e.target.checked ? {
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

    }
    handleChangeSettings(newOption)
  }

  const handleSwitchAxisPointer = (e: any) => {
    const newOption = e.target.checked ? {
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
    }
    handleChangeSettings(newOption)
  }

  const handleSwitchStepLine = (e: any) => {
    const newOption = e.target.checked ? {
      series: {
        step: "start"
      }
    } : {
      series: {
        step: false
      }
    }
    handleChangeSettings(newOption)
  }

  const handleChangeMin = (e: any) => {
    setMin(e.target.value)
    const newOption = {
      yAxis: {
        min: e.target.value,
      }
    }

    handleChangeSettings(newOption)
  }

  const handleChangeMax = (e: any) => {
    setMax(e.target.value)
    const newOption = {
      yAxis: {
        max: e.target.value,
      }
    }

    handleChangeSettings(newOption)
  }

  const handleSwitchDecimalNumber = () => {

  }

  return (
    <Box className={classes.root} mt={2}>
      <Box className={classes.headerBarContainer}>
        <Box>
          <Button className={classes.button} onClick={() => handleAdd(1)}>Add 1</Button>
          <Button className={classes.button} onClick={() => handleAdd(2)}>Add 2</Button>
          <Button className={classes.button} onClick={() => handleAdd(3)}>Add 3</Button>
          <Button className={classes.button} onClick={() => { }}>REMOVE ALL</Button>
          <Button className={classes.button} onClick={handleExport}>EXPORT</Button>
        </Box>
        <Box>
          <Button
            id="basic-button"
            className={classes.button}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            CHART SETTINGS
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<Switch checked={isAutoScale} onChange={handleSwitchAutoScale} />} label="X Axis Auto Scale" />
              </FormGroup>
            </MenuItem>
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<TextField disabled={isAutoScale} value={min} type="number" onChange={handleChangeMin} />} label="Min" />
              </FormGroup>
            </MenuItem>
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<TextField disabled={isAutoScale} value={max} type="number" onChange={handleChangeMax} />} label="Max" />
              </FormGroup>
            </MenuItem>
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchDecimalNumber} />} label="Decimal Number" />
              </FormGroup>
            </MenuItem>
            {/* <MenuItem >
          <FormGroup>
            <FormControlLabel control={<Switch checked={darkMode} onChange={handleSwitchDarkMode} />} label="Dark mode" />
          </FormGroup>
        </MenuItem> */}
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchDataZoom} />} label="Data zoom slider" />
              </FormGroup>
            </MenuItem>
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchAxisPointer} />} label="Axis pointer" />
              </FormGroup>
            </MenuItem>
            <MenuItem >
              <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitchStepLine} />} label="Step line" />
              </FormGroup>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box mt={1}>
        <EchartsLineChartSettingsTable
          columns={columns}
          rows={rows}
          cbCellClick={handleCellClick} />
      </Box>
    </Box>

  );
}
