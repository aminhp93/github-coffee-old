import DemoHOC from './DemoHOC';
import DemoHook from './DemoHook';

export interface IDemoProps {}

export default function Demo(props: IDemoProps) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <DemoHOC />
      </div>
      <div style={{ flex: 1 }}>
        <DemoHook />
      </div>
    </div>
  );
}
