import { Button } from 'antd';
import { sum } from './utils';

const Test = () => {
  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small">Button </Button>
      <div onClick={() => sum()}>sum</div>
    </div>
  );
};

export default Test;
