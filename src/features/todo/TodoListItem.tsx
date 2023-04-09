import { useDebounce } from '@/hooks';
// import PushNotificationService from '@/services/pushNotification';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  PauseOutlined,
  SettingOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, notification, Popover, TimePicker, Tooltip } from 'antd';
import CustomPlate from 'components/CustomPlate';
import dayjs from 'dayjs';
import PostService from 'features/post/service';
import { Post } from 'features/post/types';
import { memo, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';
import { v4 as uuidv4 } from 'uuid';
import './Todo.less';

const FORMAT = 'HH:mm';

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
interface Props {
  todoItem: Post;
  onDeleteSuccess?: (todoId: number) => void;
}

function TodoListItem({ todoItem, onDeleteSuccess }: Props) {
  const [plateId, setPlateId] = useState(null as any);
  const [value, setValue] = useState(JSON.parse(todoItem.content));
  const [isDone, setIsDone] = useState(todoItem.isDone);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const countDownRef = useRef<any>(null);
  const [timer, setTimer] = useState(dayjs('00:01'));
  const [status, setStatus] = useState('');
  const preventUpdate = useRef(false);
  const debouncedValue = useDebounce<string>(JSON.stringify(value), 500);
  const [toggleHeight, setToggleHeight] = useState(false);

  const handleDone = async () => {
    try {
      const data = {
        isDone: !isDone,
      };
      setIsDone(!isDone);
      await PostService.updatePost(todoItem.id, data);
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
        content: JSON.stringify(value),
      };
      await PostService.updatePost(todoItem.id, data);
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(todoItem.id);
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
                    defaultValue={dayjs('00:01')}
                    onChange={handleChangeTimer}
                    format={FORMAT}
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
        className="flex width-100"
        style={{
          background: 'transparent',
          zIndex: 1,
          alignItems: 'center',
          // minHeight: '100px',
          // maxHeight: '300px',
          height: toggleHeight ? '100%' : '200px',
        }}
      >
        <Button
          size="small"
          icon={<CloseCircleOutlined />}
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            zIndex: 1,
          }}
          onClick={() => handleDone()}
        />
        <Button
          size="small"
          icon={toggleHeight ? <UpOutlined /> : <DownOutlined />}
          style={{
            position: 'absolute',
            top: '2px',
            right: '40px',
            zIndex: 1,
          }}
          onClick={() => setToggleHeight(!toggleHeight)}
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
          date={dayjs()
            .add(timer.hour() * 60 + timer.minute(), 'minute')
            .valueOf()}
          renderer={status === 'start' ? renderer : () => null}
          onTick={handlelTick}
          // onComplete={() => handleComplete()}
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
