import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  onCb: (date: dayjs.Dayjs | undefined) => void;
  buyPoint: {
    date: dayjs.Dayjs | undefined;
  };
};

const BuyPoint = ({ onCb, buyPoint }: Props) => {
  const [date, setDate] = useState<dayjs.Dayjs | undefined>(buyPoint?.date);

  const onChange: DatePickerProps['onChange'] = (date) => {
    setDate(date!);
    onCb(date!);
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
