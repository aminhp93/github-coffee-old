export interface IConnectDashboardProps {}

export default function ConnectDashboard(props: IConnectDashboardProps) {
  return (
    <div>
      <div>Code issue</div>
      <div>Button to raise to connect</div>
      <div>After connect problem still there but can't join?</div>
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
      ></iframe>
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
      ></iframe>
    </div>
  );
}
