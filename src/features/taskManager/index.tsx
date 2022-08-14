import { Input, Progress } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Contanier from './Container';

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
    </div>
  );
}
