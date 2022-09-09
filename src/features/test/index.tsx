import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Echarts from 'components/Echarts';
import { add, selectDemo } from 'features/demo/demoSlice';
import { memo, useState } from 'react';

const Child = ({ cb }: any) => {
  console.log('child');
  const handleClick = () => {
    console.log('click child');
    cb && cb();
  };
  return <div onClick={handleClick}>Child</div>;
};

const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    data: [1, 2],
  },
  yAxis: {},
  series: [
    {
      data: [1, 2],
      type: 'line',
      triggerLineEvent: true,
    },
  ],
};

const MemoChild = memo(Child);

export default function Component() {
  console.log('component');
  const dispatch = useAppDispatch();

  const demo = useAppSelector(selectDemo);
  const [count, setCount] = useState(1);

  const handleClick = () => {
    console.log(count);
    setCount((count) => count + 1);
  };

  // const handleHighlight = useCallback(
  //   (data: any) => {
  //     console.log(data, demo);
  //   },
  //   [demo]
  // );

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => dispatch(add())}>Add</Button>
      <button onClick={handleClick}>increase</button>
      {/* <MemoChild cb={handleClick} /> */}
      <Echarts
        option={option}
        // handleHighlight={handleHighlight}
      />
    </div>
  );
}
