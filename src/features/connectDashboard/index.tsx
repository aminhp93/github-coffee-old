import { Button, Input } from 'antd';
import { useState, useRef } from 'react';
import type { InputRef } from 'antd';

export default function ConnectDashboard() {
  const [problemSrc, setProblemSrc] = useState('');
  const [showListOldProblems, setShowListOldProblems] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const handleCreateProblem = () => {
    if (inputRef?.current?.input?.value) {
      setProblemSrc(inputRef?.current?.input?.value);
    }
  };

  const handleUseDefaultTemplate = () => {
    setProblemSrc(
      'https://codesandbox.io/embed/github/aminhp93/problem-react-template/tree/main/?fontsize=14&hidenavigation=1&theme=dark'
    );
  };

  return (
    <div>
      <div>Code issue</div>
      <div>Button to raise to connect</div>
      <div>After connect problem still there but can't join?</div>
      <Input ref={inputRef} />
      <Button onClick={handleCreateProblem}>Use your own</Button>
      <Button onClick={handleUseDefaultTemplate}>Use default template</Button>
      <iframe
        src={problemSrc}
        style={{
          width: '100%',
          height: '500px',
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
        title="hello123"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
      <Button onClick={() => setShowListOldProblems((old) => !old)}>
        Show list old problems
      </Button>
      {showListOldProblems && (
        <>
          <div>Problem</div>

          <iframe
            src="https://codesandbox.io/embed/github/aminhp93/problem-1-update-child-state-from-parent/tree/problem/?fontsize=14&hidenavigation=1&theme=dark"
            style={{
              width: '100%',
              height: '500px',
              border: 0,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
            title="problem-1-update-child-state-from-parent"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
          <div>Solution</div>
          <iframe
            src="https://codesandbox.io/embed/github/aminhp93/problem-1-update-child-state-from-parent/tree/solution/?fontsize=14&hidenavigation=1&theme=dark"
            style={{
              width: '100%',
              height: '500px',
              border: 0,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
            title="problem-1-update-child-state-from-parent"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </>
      )}
    </div>
  );
}
