import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

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
      value={date ? moment(date) : undefined}
      onChange={onChange}
    />
  );
};

export default BuyPoint;
