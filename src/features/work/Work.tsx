// Import libraries
import { Button, Dropdown } from 'antd';
import { IJsonModel } from 'flexlayout-react';
import { SettingOutlined } from '@ant-design/icons';
import { keyBy } from 'lodash';
import type { MenuProps } from 'antd';

// Import local files
import CustomFlexLayout from 'components/customFlexLayout/CustomFlexLayout';
import Chat from 'features/chat/Chat';
import Post from 'features/post/Post';
import Snippet from 'features/snippet/Snippet';
import StockDetail from 'features/stock/StockDetail';
import StockManager from 'features/stock/stockManager/StockManager';
import StockNews from 'features/stock/StockNews';
import StockTable from 'features/stock/stockTable/StockTable';
import Figma from 'features/figma/Figma';
import Todo from 'features/todo/Todo';
import Test from 'features/test/Test';
import Booking from 'features/booking/Booking';
import { DROPDOWN_LIST } from './Work.constants';

type Props = {
  defaultJson: IJsonModel;
  layoutName: string;
};

const Work = ({ layoutName, defaultJson }: Props) => {
  const onChangeLayout = (layout: string) => {
    if (!layout) return;
    const DROPDOWN_LIST_OBJ = keyBy(DROPDOWN_LIST, 'key');
    const layoutNameData = DROPDOWN_LIST_OBJ[layout]?.layoutName;
    if (!layoutNameData) return;
    localStorage.setItem(layoutName, JSON.stringify(layoutNameData));
    window.location.reload();
  };

  const handleClickDropdown: MenuProps['onClick'] = ({ key }) => {
    if (key) {
      onChangeLayout(key);
    }
  };

  return (
    <>
      <CustomFlexLayout
        layoutName={layoutName}
        defaultJson={defaultJson}
        componentObj={{
          Post: <Post />,
          StockNews: <StockNews />,
          Chat: <Chat hideOnlineUsers />,
          Todo: <Todo />,
          Snippet: <Snippet />,
          Test: <Test />,
          StockTable: <StockTable />,
          StockDetail: <StockDetail />,
          StockManager: <StockManager />,
          Figma: <Figma />,
          Booking: <Booking />,
        }}
      />
      <Dropdown
        menu={{ items: DROPDOWN_LIST, onClick: handleClickDropdown }}
        trigger={['hover']}
      >
        <Button
          size="small"
          style={{ position: 'fixed', bottom: '6px', right: '2px', zIndex: 1 }}
          icon={<SettingOutlined />}
        />
      </Dropdown>
    </>
  );
};

export default Work;
