import { Dropdown, message, Tag } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Todo } from './Todo.types';
import useStatusStore from '../status/store';
import { getStatusColor } from '../status/utils';
import { ValueGetterParams } from 'ag-grid-community';
import { TData } from 'components/customAgGridReact/CustomAgGridReact';

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: 'Delete',
  },
];

type Props = {
  handleDelete?: (data: string) => void;
  handleUpdate?: (key: string, data: Todo) => Promise<void>;
};

const TodoTableColumns = ({ handleDelete, handleUpdate }: Props) => {
  const status = useStatusStore((state) => state.status);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
    if (key === 'delete') {
      if (!handleDelete) return;
      handleDelete(key);
    }
  };

  return [
    {
      headerName: 'status',
      field: 'status',
      hide: true,
      filter: true,
      rowGroup: true,
      cellRenderer: (data: TData) => {
        return status[data.value].label;
      },
    },
    {
      headerName: 'Title',
      field: 'title',
      width: 800,

      cellRenderer: (data: ValueGetterParams) => {
        const todoData: Todo = data.data;
        if (!todoData) return null;

        const item2: MenuProps['items'] = Object.values(status).map((i) => {
          return {
            key: i.id,
            label: i.label,
            data: i,
            icon: (
              <Tag color={getStatusColor(i)} style={{ color: 'transparent' }}>
                t
              </Tag>
            ),
          };
        });

        const onClickTitle: MenuProps['onClick'] = ({ key }) => {
          if (!handleUpdate) return;
          handleUpdate(key, todoData);
        };

        return (
          <div>
            <Dropdown
              menu={{ items: item2, onClick: onClickTitle }}
              trigger={['click']}
            >
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
