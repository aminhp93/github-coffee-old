import { Button } from 'antd';
import CustomPlate from 'components/CustomPlate';
import * as React from 'react';
import { ITodo } from 'types';
import { v4 as uuidv4 } from 'uuid';
import './TodoListItem.less';

interface IProps {
  data: any;
  onMarkDone: (data: ITodo) => void;
}

function TodoListItem({ data, onMarkDone }: IProps) {
  const [plateId, setPlateId] = React.useState(null as any);
  console.log(plateId);
  const [isDone, setIsDone] = React.useState(false);
  console.log('TodoListItem', data, JSON.parse(data.body));

  const handleDone = () => {
    setIsDone(!isDone);
    onMarkDone && onMarkDone({ ...data, is_done: true });
  };

  React.useEffect(() => {
    setPlateId(uuidv4());
  }, [data]);

  return (
    <div
      className={`TodoListItem flex `}
      style={{
        position: 'relative',
      }}
    >
      {data.id}
      <CustomPlate
        id={String(plateId)}
        value={JSON.parse(data.body)}
        // onChange={handleChange}
      />
      <div className="TodoListItem-toolbox">
        <Button
          style={{ zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation();

            handleDone();
          }}
        >
          {data.is_done ? 'Undo' : 'Done'}
        </Button>
      </div>
    </div>
  );
}

const MemoizedTodoListItem = React.memo(TodoListItem);

export default MemoizedTodoListItem;
