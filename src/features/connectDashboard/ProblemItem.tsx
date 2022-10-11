import * as React from 'react';

interface IProblemItemProps {
  problem: any;
}

export default function ProblemItem({ problem }: IProblemItemProps) {
  const [showProblem, setShowProblem] = React.useState(true);
  const [showSolution, setShowSolution] = React.useState(false);

  return (
    <div key={problem.id}>
      <div onClick={() => setShowProblem(!showProblem)}>
        {showProblem ? 'Hide' : 'Show'} Problem - {problem.id} -{' '}
        {problem.created_at}
      </div>
      {showProblem && (
        <iframe
          // src="https://codesandbox.io/embed/github/aminhp93/problem-1-update-child-state-from-parent/tree/problem/?fontsize=14&hidenavigation=1&theme=dark"
          src={problem.problem_src}
          style={{
            width: '100%',
            height: '300px',
            border: 0,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          title="problem-1-update-child-state-from-parent"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      )}
      <div onClick={() => setShowSolution(!showSolution)}>
        {showSolution ? 'Hide' : 'Show'}Solution
      </div>
      {showSolution && (
        <iframe
          src="https://codesandbox.io/embed/github/aminhp93/problem-1-update-child-state-from-parent/tree/solution/?fontsize=14&hidenavigation=1&theme=dark"
          style={{
            width: '100%',
            height: '300px',
            border: 0,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          title="problem-1-update-child-state-from-parent"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      )}
    </div>
  );
}
