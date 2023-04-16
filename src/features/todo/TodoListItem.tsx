import { useDebounce } from '@/hooks';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  SettingOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, notification, Popover, Tooltip } from 'antd';
import CustomLexical from 'components/customLexical/CustomLexical';
import PostService from 'features/post/service';
import { Post } from 'features/post/types';
import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Todo.less';

interface Props {
  todoItem: Post;
  onDeleteSuccess?: (todoId: number) => void;
}

function TodoListItem({ todoItem, onDeleteSuccess }: Props) {
  const [, setPlateId] = useState(null as any);
  const [value] = useState(JSON.parse(todoItem.content));
  const [isDone, setIsDone] = useState(todoItem.isDone);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

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

        {/* <CustomPlate
          id={String(plateId)}
          value={value}
          hideToolBar
          onChange={handleChange}
        /> */}
        <CustomLexical data={value} />

        {renderPopover()}
      </div>
    </div>
  );
}

// const areEqual = (prevProps: any, nextProps: any) => {
//   return isEqual(prevProps.todoItem, nextProps.todoItem);
// };

const MemoizedTodoListItem = memo(TodoListItem);

export default MemoizedTodoListItem;
