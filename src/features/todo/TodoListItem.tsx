import {
  DeleteOutlined,
  FieldTimeOutlined,
  PauseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  notification,
  TimePicker,
  Tooltip,
  Popover,
} from 'antd';
import axios from 'axios';
import CustomPlate from 'components/CustomPlate';
import type { Identifier, XYCoord } from 'dnd-core';
import config from 'libs/config';
import { ITodo } from 'libs/types';
import moment from 'moment';
import React, { useEffect } from 'react';
import Countdown from 'react-countdown';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import './TodoListItem.less';
import { TodoService } from 'libs/services';

const format = 'HH:mm';

const baseUrl = config.apiUrl;
const Completionist = () => <span>You are good to go!</span>;

const renderer = (props: any) => {
  const { days, hours, minutes, seconds, completed } = props;
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span
        style={{
          margin: '60px 40px 0 0',
          position: 'absolute',
          bottom: 0,
          right: '20px',
        }}
      >
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};
interface IProps {
  countPrevious: number;
  id: number;
  todoItem: any;
  index: number;
  onMarkDone?: (todo: ITodo) => void;
  onDeleteSuccess?: (todoId: number) => void;
  onUpdateSuccess?: (todo: ITodo) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function TodoListItem({
  countPrevious,
  todoItem,
  onMarkDone,
  onUpdateSuccess,
  onDeleteSuccess,
  index,
  id,
  moveCard,
}: IProps) {
  const [plateId, setPlateId] = React.useState(null as any);
  const [value, setValue] = React.useState(JSON.parse(todoItem.body));
  const [isDone, setIsDone] = React.useState(todoItem.is_done);
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false);
  const divRef = React.useRef<HTMLDivElement>(null);
  const countDownRef = React.useRef<any>(null);
  const [timer, setTimer] = React.useState(moment('00:01', format));
  const [status, setStatus] = React.useState('');

  const handleDone = async () => {
    try {
      const data = {
        is_done: !isDone,
      };
      setIsDone(!isDone);
      await TodoService.updateTodo(todoItem.id, data);
      notification.success({
        message: 'Marked done',
      });
      onMarkDone && onMarkDone({ ...todoItem, is_done: !isDone });
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        body: JSON.stringify(value),
      };
      const res = await TodoService.updateTodo(todoItem.id, data);
      onUpdateSuccess && onUpdateSuccess(res.data);
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await TodoService.deleteTodo(todoItem.id);
      onDeleteSuccess && onDeleteSuccess(todoItem.id);
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleChange = (data: any) => {
    setValue(data);
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleStartTimer = () => {
    setStatus('start');
    countDownRef.current && countDownRef.current.start();
  };

  const handleResetTimer = () => {
    setStatus('');

    countDownRef.current && countDownRef.current.stop();
    if (divRef.current) {
      divRef.current.style.width = `0%`;
    }
  };

  const handleComplete = (data: any) => {
    if (divRef.current) {
      divRef.current.style.width = `0%`;
    }
    axios({
      url: `${baseUrl}/api/pushnotifications/`,
      method: 'POST',
    });
    notification.success({ message: 'Time is up!' });
  };

  const handlelTick = (data: any) => {
    if (divRef.current) {
      divRef.current.style.width = `${
        (100 * data.total) / ((timer.hour() * 60 + timer.minute()) * 60 * 1000)
      }%`;
    }
  };

  const handleChangeTimer = (data: any) => {
    setTimer(data);
  };

  useEffect(() => {
    setPlateId(uuidv4());
  }, [todoItem]);

  useEffect(() => {
    const timer = setTimeout(handleUpdate, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const renderPopover = () => {
    return (
      <Popover
        placement="leftBottom"
        trigger="hover"
        content={
          <div className="TodoListItem-toolbox">
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
                    style={{ zIndex: 1, marginLeft: '8px' }}
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
            {status === '' && (
              <Tooltip placement="right" title="Start timer">
                <div style={{ marginTop: '8px' }}>
                  <TimePicker
                    defaultValue={moment('00:01', format)}
                    onChange={handleChangeTimer}
                    format={format}
                  />
                  <Button
                    style={{ marginLeft: '8px' }}
                    icon={<FieldTimeOutlined />}
                    onClick={handleStartTimer}
                  />
                </div>
              </Tooltip>
            )}
            {status === 'start' && (
              <Tooltip placement="right" title="Reset time">
                <Button
                  style={{ marginTop: '8px' }}
                  icon={<PauseOutlined />}
                  onClick={handleResetTimer}
                />
              </Tooltip>
            )}
          </div>
        }
      >
        <Button
          icon={<SettingOutlined />}
          style={{ position: 'absolute', bottom: '2px', right: '2px' }}
        />
      </Popover>
    );
  };

  if (isDone) return null;

  return (
    <div ref={ref} data-handler-id={handlerId} className={`TodoListItem flex `}>
      <div
        ref={divRef}
        style={{
          position: 'absolute',
          background: 'red',
          width: '0%',
          height: '100%',
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <div
        className="flex height-100 width-100"
        style={{
          background: 'transparent',
          zIndex: 1,
          alignItems: 'center',
          minHeight: '100px',
          maxHeight: '300px',
        }}
      >
        <Checkbox
          defaultChecked={todoItem.is_done}
          onClick={() => handleDone()}
        />

        <CustomPlate
          id={String(plateId)}
          value={value}
          hideToolBar
          onChange={handleChange}
        />

        {renderPopover()}

        <Countdown
          ref={countDownRef}
          date={moment()
            .add(timer.hour() * 60 + timer.minute(), 'minute')
            .valueOf()}
          renderer={status === 'start' ? renderer : () => null}
          onTick={handlelTick}
          onComplete={handleComplete}
          autoStart={false}
        />
      </div>
    </div>
  );
}

const MemoizedTodoListItem = React.memo(TodoListItem);

export default MemoizedTodoListItem;
