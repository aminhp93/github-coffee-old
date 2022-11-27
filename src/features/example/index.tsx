import * as React from 'react';

export interface IExampleProps {}

export default function Example(props: IExampleProps) {
  return (
    <div>
      <iframe
        src="https://codesandbox.io/embed/github/aminhp93/example/tree/main/crud-using-swr?fontsize=14&hidenavigation=1&theme=dark"
        style={{
          width: '100%',
          height: '500px',
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
        title="crud-using-swr"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
}
