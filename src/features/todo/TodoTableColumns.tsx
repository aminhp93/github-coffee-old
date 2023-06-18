import { Dropdown, message, Tag } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Todo } from './Todo.types';
import useStatusStore from '../status/store';
import { getStatusColor } from '../status/utils';
import { ValueGetterParams } from 'ag-grid-community';

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: 'Delete',
  },
];

const TodoTableColumns = (handleDelete: (data: string) => void) => {
  const status = useStatusStore((state) => state.status);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
    if (key === 'delete') {
      handleDelete && handleDelete(key);
    }
  };

  return [
    {
      headerName: 'Title',
      field: 'title',
      suppressMenu: true,
      width: 800,
      cellRenderer: (data: ValueGetterParams) => {
        const todoData: Todo = data.data;
        const item2: MenuProps['items'] = Object.values(status).map((i) => {
          return {
            key: i.id,
            label: i.label,
          };
        });

        return (
          <div>
            <Dropdown menu={{ items: item2, onClick }} trigger={['click']}>
              <Tag
                color={getStatusColor(status[todoData.status])}
                style={{ color: 'transparent' }}
              >
                t
              </Tag>
            </Dropdown>
            {todoData.title}
          </div>
        );
      },
    },
    {
      headerName: '',
      field: 'action',
      width: 100,
      cellStyle: { textAlign: 'center' },

      cellRenderer: () => {
        return (
          <Dropdown menu={{ items, onClick }} trigger={['click']}>
            <MoreOutlined />
          </Dropdown>
        );
      },
    },
  ];
};

export default TodoTableColumns;
