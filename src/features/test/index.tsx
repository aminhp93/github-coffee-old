import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectDemo } from 'features/demo/demoSlice';
import { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
  const [text, setText] = useState('');

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

  const createNewTable = () => {};

  useEffect(() => {
    // fetch(README)
    //   .then((res) => res.text())
    //   .then((text) => setText(text));
  }, []);

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      {/* <p>Count: {count}</p>
      <Button onClick={() => dispatch(add())}>Add</Button>
      <button onClick={handleClick}>increase</button>
      <MemoChild cb={handleClick} />
      <Echarts
        option={option}
        handleHighlight={handleHighlight}
      /> */}
      <ReactMarkdown children={text} />
    </div>
  );
}
