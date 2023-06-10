import { Dropdown, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: 'Delete',
  },
];

const TodoTableColumns = (handleDelete: any) => {
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
      // width: 400,
    },
    {
      headerName: '',
      field: 'action',
      // width: 400,
      cellRenderer: () => {
        return (
          <Dropdown menu={{ items, onClick }}>
            <MoreOutlined />
          </Dropdown>
        );
      },
    },
  ];
};

export default TodoTableColumns;
