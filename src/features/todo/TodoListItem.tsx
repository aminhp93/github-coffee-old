import {
  CheckOutlined,
  DeleteOutlined,
  PauseOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Checkbox, notification, TimePicker } from 'antd';
import CustomPlate from 'components/CustomPlate';
import type { Identifier, XYCoord } from 'dnd-core';
import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ITodo } from 'types';
import { v4 as uuidv4 } from 'uuid';
import './TodoListItem.less';
import Countdown from 'react-countdown';
import moment from 'moment';
import axios from 'axios';
import config from 'config';
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
      <span style={{ margin: '60px 40px 0 0' }}>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};
interface IProps {
  id: number;
  todoItem: any;
  index: number;
  onMarkDone?: (data: ITodo) => void;
  onDelete?: (data: ITodo) => void;
  onUpdate?: (data: ITodo) => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function TodoListItem({
  todoItem,
  onMarkDone,
  onUpdate,
  onDelete,
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

  const endOfYear = moment()
    .add(timer.minute(), 'minute')
    .format('YYYY-MM-DD HH:mm:ss');

  //   get miliseconds time at the end of the year
  const endOfYearMiliseconds = moment(endOfYear).valueOf();
  console.log(endOfYearMiliseconds);

  console.log('TodoListItem', todoItem, JSON.parse(todoItem.body));

  const handleDone = () => {
    setIsDone(!isDone);
    onMarkDone && onMarkDone({ ...todoItem, is_done: !isDone });
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

  React.useEffect(() => {
    setPlateId(uuidv4());
  }, [todoItem]);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`TodoListItem flex `}
      style={{
        position: 'relative',
        height: '100px',
      }}
    >
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
      ></div>
      <div
        className="flex"
        style={{
          position: 'absolute',
          background: 'transparent',
          width: '100%',
          height: '100%',
          zIndex: 1,
          alignItems: 'center',
        }}
      >
        <Checkbox
          defaultChecked={todoItem.is_done}
          onClick={() => handleDone()}
        ></Checkbox>
        {todoItem.id}
        <CustomPlate
          id={String(plateId)}
          value={value}
          onChange={handleChange}
        />
        <div className="TodoListItem-toolbox">
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
          {status === '' && (
            <Tooltip placement="right" title="Start timer">
              <TimePicker
                defaultValue={moment('00:01', format)}
                onChange={handleChangeTimer}
                format={format}
              />
              <Button icon={<FieldTimeOutlined />} onClick={handleStartTimer} />
            </Tooltip>
          )}
          {status === 'start' && (
            <Tooltip placement="right" title="Reset time">
              <Button icon={<PauseOutlined />} onClick={handleResetTimer} />
            </Tooltip>
          )}
        </div>
        <Countdown
          ref={countDownRef}
          date={moment()
            .add(timer.hour() * 60 + timer.minute(), 'minute')
            .valueOf()}
          renderer={renderer}
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
