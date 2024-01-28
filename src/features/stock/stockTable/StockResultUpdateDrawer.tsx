/* eslint-disable @typescript-eslint/no-explicit-any */

import { Drawer, Progress } from 'antd';

type Props = {
  onClose: () => void;
  data: any;
};

const StockResultUpdateDrawer = ({ onClose, data }: Props) => {
  console.log(data);
  const valid = (data?.res || []).filter((i: any) => i[0]?.symbol).length;
  const all = (data?.list_all || []).length;
  const percent = (100 * valid) / all;
  return (
    <Drawer
      title="Stock Result Update"
      placement="bottom"
      height="100%"
      onClose={onClose}
      open={true}
    >
      {`${valid} / ${all}`}
      <Progress percent={percent} />
    </Drawer>
  );
};

export default StockResultUpdateDrawer;
