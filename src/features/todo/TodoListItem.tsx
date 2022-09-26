import { Button, Tooltip } from 'antd';
import CustomPlate from 'components/CustomPlate';
import * as React from 'react';
import { ITodo } from 'types';
import { v4 as uuidv4 } from 'uuid';
import './TodoListItem.less';
import {
  CheckOutlined,
  DeleteOutlined,
  ScissorOutlined,
} from '@ant-design/icons';

interface IProps {
  todoItem: any;
  onMarkDone?: (data: ITodo) => void;
  onDelete?: (data: ITodo) => void;
  onUpdate?: (data: ITodo) => void;
}

function TodoListItem({ todoItem, onMarkDone, onUpdate, onDelete }: IProps) {
  const [plateId, setPlateId] = React.useState(null as any);
  const [value, setValue] = React.useState(JSON.parse(todoItem.body));
  const [isDone, setIsDone] = React.useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false);
  console.log('TodoListItem', todoItem, JSON.parse(todoItem.body));

  const handleDone = () => {
    setIsDone(!isDone);
    onMarkDone && onMarkDone({ ...todoItem, is_done: true });
  };

  const handleUpdate = () => {
    onUpdate && onUpdate({ ...todoItem, value });
  };

  const handleDelete = () => {
    onDelete && onDelete(todoItem);
  };

  const handleChange = (data: any) => {
    console.log(data);
    setValue(data);
  };

  React.useEffect(() => {
    setPlateId(uuidv4());
  }, [todoItem]);

  return (
    <div
      className={`TodoListItem flex `}
      style={{
        position: 'relative',
      }}
    >
      {todoItem.id}
      <CustomPlate id={String(plateId)} value={value} onChange={handleChange} />
      <div className="TodoListItem-toolbox">
        <Tooltip placement="right" title={todoItem.is_done ? 'Undo' : 'Done'}>
          <Button
            icon={<ScissorOutlined />}
            style={{ zIndex: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDone();
            }}
          />
        </Tooltip>
        <Tooltip placement="right" title="update">
          <Button
            icon={<CheckOutlined />}
            style={{ zIndex: 1 }}
            onClick={(e) => {
              e.stopPropagation();

              handleUpdate();
            }}
          />
        </Tooltip>
        <Tooltip placement="right" title="delete">
          {isConfirmDelete ? (
            <>
              <Button
                style={{ zIndex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();

                  handleDelete();
                }}
              >
                Confirm
              </Button>
              <Button
                style={{ zIndex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();

                  setIsConfirmDelete(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              icon={<DeleteOutlined />}
              style={{ zIndex: 1 }}
              onClick={(e) => {
                e.stopPropagation();

                setIsConfirmDelete(true);
              }}
            />
          )}
        </Tooltip>
      </div>
    </div>
  );
}

const MemoizedTodoListItem = React.memo(TodoListItem);

export default MemoizedTodoListItem;
