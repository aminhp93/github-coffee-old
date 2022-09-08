import { useEffect, useState } from 'react';
import { Input, Progress, Slider } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Contanier from './Container';
import ReactSlider from 'react-slider';
import './index.less';

const LIST_TASK = [
  {
    taskName: 'task 1',
    time: 60,
    color: 'red',
  },
  {
    taskName: 'task 2',
    time: 30,
    color: 'blue',
  },
  {
    taskName: 'task 3',
    time: 90,
    color: 'green',
  },
];

const TOTAL_TIME = 240;

export interface TaskManagerProps {}

export default function TaskManager(props: TaskManagerProps) {
  const [progress, setProgress] = useState(10);

  console.log(process.env);

  const handleSlide = (newProgress: any) => setProgress(newProgress);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Input
          style={{ width: '10rem' }}
          placeholder="Start"
          defaultValue={'08:00'}
        />
        <Input
          style={{ width: '10rem' }}
          placeholder="End"
          defaultValue={'12:00'}
        />
      </div>
      <div style={{ display: 'flex', background: 'lightblue' }}>
        {LIST_TASK.map((i: any) => {
          return (
            <div
              style={{
                background: i.color,
                width: `${(i.time / TOTAL_TIME) * 100}%`,
              }}
            >
              {i.taskName}
            </div>
          );
        })}
      </div>
      <div>
        <Progress percent={30} />
      </div>
      <DndProvider backend={HTML5Backend}>
        <Contanier />
      </DndProvider>
      {/* <div style={{ background: 'white', margin: '0 20px' }}>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={[0, 20, 50, 100]}
          ariaLabel={['Leftmost thumb', 'Middle thumb', 'Rightmost thumb']}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          renderTrack={(props, state) => <div {...props}>track</div>}
          renderMark={(props) => <span {...props}>mark</span>}
          pearling
          minDistance={10}
        />
      </div> */}
    </div>
  );
}
