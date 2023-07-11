import { Drawer } from 'antd';
import StockTrending from './StockTrending';

type Props = {
  onClose: () => void;
};

const StockTrendingDrawer = ({ onClose }: Props) => {
  return (
    <Drawer
      title="Stock Trending"
      placement="bottom"
      height="100%"
      onClose={onClose}
      open={true}
    >
      <StockTrending />
    </Drawer>
  );
};

export default StockTrendingDrawer;
