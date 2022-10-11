import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';

function Child({ random }: any) {
  const [count, setCount] = useState(random);

  console.log('child', count, random);

  useEffect(() => {
    random && setCount(random);
  }, [random]);

  return (
    <div>
      <Button onClick={() => setCount((count: number) => count + 1)}>
        Add
      </Button>
      {count}
    </div>
  );
}
const MemoizedChild = React.memo(Child);

export default MemoizedChild;
