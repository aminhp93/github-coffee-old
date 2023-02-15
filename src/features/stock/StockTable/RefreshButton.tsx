import { useInterval } from '@/hooks/useInterval';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover, Statistic } from 'antd';
import { useState } from 'react';
import { DELAY_TIME } from '../constants';

const { Countdown } = Statistic;

const RefreshButton = ({ onClick }: any) => {
  const [isPlaying, setPlaying] = useState<boolean>(true);
  const [delay, setDelay] = useState<number>(DELAY_TIME);

  useInterval(
    () => {
      // Your custom logic here
      onClick();
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null
  );

  const content = () => {
    return (
      <>
        <Button
          style={{ marginLeft: '8px' }}
          size="small"
          onClick={() => setPlaying(!isPlaying)}
        >
          {isPlaying ? 'Stop Interval' : 'Start Interval'}
        </Button>
        <InputNumber
          size="small"
          style={{ marginLeft: '8px' }}
          disabled={isPlaying}
          value={delay}
          onChange={(value: any) => setDelay(value)}
        />
      </>
    );
  };

  console.log('delay', delay);

  return (
    <Popover content={content}>
      <Button size="small" onClick={onClick}>
        {isPlaying ? (
          <Countdown
            valueStyle={{
              fontSize: '14px',
            }}
            value={Date.now() + delay}
          />
        ) : (
          <CheckCircleOutlined />
        )}
      </Button>
    </Popover>
  );
};

export default RefreshButton;
