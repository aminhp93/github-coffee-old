import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const BuyPoint = ({ onCb, buyPoint }: any) => {
  const [date, setDate] = useState<any>(buyPoint?.date);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDate(date);
    onCb(date);
  };

  useEffect(() => {
    setDate(buyPoint?.date);
  }, [buyPoint]);

  return (
    <DatePicker
      size="small"
      value={date ? dayjs(date) : undefined}
      onChange={onChange}
    />
  );
};

export default BuyPoint;
