import Countdown from 'react-countdown';
import moment from 'moment';
import { useRef } from 'react';
import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import * as React from 'react';

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = (props: any) => {
  const { days, hours, minutes, seconds, completed } = props;
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};

export default function Notice() {
  const countDownRef = React.useRef<any>(null);

  // get time at the end of the year
  const divRef = useRef<HTMLDivElement>(null);
  const endOfYear = moment().add(1, 'minute').format('YYYY-MM-DD HH:mm:ss');

  //   get miliseconds time at the end of the year
  const endOfYearMiliseconds = moment(endOfYear).valueOf();
  console.log(endOfYearMiliseconds);

  const handleStart = (data: any) => {
    console.log(data);
  };

  const handlelTick = (data: any) => {
    console.log(data, divRef.current, data.total / (60 * 1000));
    if (divRef.current) {
      divRef.current.style.width = `${(100 * data.total) / (60 * 1000)}%`;
    }
  };

  const handleStartTimer = () => {
    countDownRef.current && countDownRef.current.start();
  };

  return (
    <div style={{ fontSize: '30px', position: 'relative', height: '100%' }}>
      <div
        ref={divRef}
        style={{
          position: 'absolute',
          background: 'red',
          width: '0%',
          height: '100%',
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          background: 'transparent',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <Countdown
          ref={countDownRef}
          date={endOfYearMiliseconds}
          renderer={renderer}
          onStart={handleStart}
          onTick={handlelTick}
          autoStart={false}
        />
        <Tooltip placement="right" title="set time">
          <Button icon={<FieldTimeOutlined />} onClick={handleStartTimer} />
        </Tooltip>
      </div>
    </div>
  );
}
