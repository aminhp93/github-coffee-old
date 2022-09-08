import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import * as React from 'react';

export default function BasicDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <Box sx={{ background: 'white' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Basic example"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button>button</Button>
    </Box>
  );
}
