import { connect } from 'react-redux';
import withRouter from 'components/withRouter';
import { get } from 'lodash';
import { add, update, remove, fetchRandom } from './demoSlice';
import { Button, Divider } from 'antd';

interface IProps {
  demo: any;
  add: any;
  update: any;
  remove: any;
  fetchRandom: any;
}

function DemoHOC({ demo, add, update, remove, fetchRandom }: IProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div>Demo HOC</div>
        <div>
          <Button onClick={() => add()}>Add</Button>
          <Button onClick={() => fetchRandom()}>Fetch random</Button>
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
                <Button onClick={() => update(i)}>Update</Button>
                <Button onClick={() => remove(i)}>Delete</Button>
              </div>
            </div>
            <Divider />
          </>
        );
      })}
    </div>
  );
}

const mapStateToProps = (state: any) => {
  console.log(state);
  return {
    demo: get(state, 'demo'),
  };
};

const mapDispatchToProps = {
  add,
  update,
  remove,
  fetchRandom,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DemoHOC)
);
