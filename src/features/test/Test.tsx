import { Button } from 'antd';

const Test = () => {
  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small">Button </Button>
      <iframe
        title="clickup share"
        className="clickup-embed"
        src="https://sharing.clickup.com/2576368/l/h/6-900801027760-1/87805ba4bbce89a"
        width="100%"
        height="700px"
        style={{ background: 'transparent', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default Test;
