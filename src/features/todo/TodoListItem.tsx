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
  Popover,
  TimePicker,
  Tooltip,
} from 'antd';
import CustomPlate from 'components/CustomPlate';
import { useDebounce } from 'libs/hooks';
import { PushNotificationService, TodoService } from 'libs/services';
import { ITodo } from 'libs/types';
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';
import { v4 as uuidv4 } from 'uuid';
import './TodoListItem.less';

const format = 'HH:mm';

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
  todoItem: ITodo;
  onDeleteSuccess?: (todoId: number) => void;
}

function TodoListItem({ todoItem, onDeleteSuccess }: IProps) {
  const [plateId, setPlateId] = useState(null as any);
  const [value, setValue] = useState(JSON.parse(todoItem.body));
  const [isDone, setIsDone] = useState(todoItem.isDone);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const countDownRef = useRef<any>(null);
  const [timer, setTimer] = useState(moment('00:01', format));
  const [status, setStatus] = useState('');
  const preventUpdate = useRef(false);
  const debouncedValue = useDebounce<string>(JSON.stringify(value), 500);

  const handleDone = async () => {
    try {
      const data = {
        isDone: !isDone,
      };
      setIsDone(!isDone);
      await TodoService.updateTodo(todoItem.id, data);
      notification.success({
        message: 'Marked done',
      });
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
      await TodoService.updateTodo(todoItem.id, data);
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
    preventUpdate.current = false;
    setValue(data);
  };

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

  const handleComplete = () => {
    if (divRef.current) {
      divRef.current.style.width = `0%`;
    }

    PushNotificationService.createPushNotification({
      title: 'Time for your task is up!',
      body: `Time for task ${todoItem.id} is up!`,
    });

    notification.success({ message: 'Time for your task is up!' });
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
    if (preventUpdate.current) return;
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
                    size="small"
                    style={{ zIndex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDelete();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="small"
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
                  size="small"
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
                    size="small"
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
                  size="small"
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
          size="small"
          icon={<SettingOutlined />}
          style={{ position: 'absolute', bottom: '2px', right: '2px' }}
        />
      </Popover>
    );
  };

  if (isDone) return null;

  return (
    <div className={`TodoListItem flex `}>
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
          defaultChecked={todoItem.isDone}
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

// const areEqual = (prevProps: any, nextProps: any) => {
//   return isEqual(prevProps.todoItem, nextProps.todoItem);
// };

const MemoizedTodoListItem = memo(TodoListItem);

export default MemoizedTodoListItem;
