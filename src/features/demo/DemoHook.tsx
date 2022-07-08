import { add, update, remove, fetchRandom, selectDemo } from './demoSlice';
import { Button, Divider } from 'antd';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { useNavigate } from 'react-router-dom';

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
        <div>Demo Hook</div>
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

var tip = 100;

(function () {
  console.log('i have ' + hus());
  function w() {
    return tip * 2;
  }
  function hus() {
    return w() / 2;
  }
  // var tip = 10
})();

for (let i = 0; i < 3; i++) {
  console.log(i);
  setTimeout(() => {
    console.log(i);
  }, 5000);
}

for (let i = 0; i < 3; i++) {
  console.log(i);
  setTimeout(function () {
    console.log(i);
  }, 2000);
}
