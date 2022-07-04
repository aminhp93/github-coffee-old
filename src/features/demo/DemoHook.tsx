import { add, update, remove, fetchRandom, selectDemo } from './demoSlice';
import { Button, Divider } from 'antd';
import { useAppSelector, useAppDispatch } from 'app/hooks';

function DemoHook() {
  const demo = useAppSelector(selectDemo);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div>Demo</div>
        <div>
          <Button onClick={() => dispatch(add())}>Add</Button>
          <Button onClick={() => dispatch(fetchRandom())}>Fetch random</Button>
        </div>
      </div>

      <Divider />
      {demo.map((i: any) => {
        return (
          <>
            <div
              key={i.id}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div>{i.name}</div>
              <div>
                <Button onClick={() => dispatch(update(i))}>Update</Button>
                <Button onClick={() => dispatch(remove(i))}>Delete</Button>
              </div>
            </div>
            <Divider />
          </>
        );
      })}
    </div>
  );
}

export default DemoHook;
