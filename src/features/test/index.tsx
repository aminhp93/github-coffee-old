import { useEffect } from 'react';

export default function Component() {
  console.log('component');

  useEffect(() => {
    // fetch(README)
    //   .then((res) => res.text())
    //   .then((text) => setText(text));
  }, []);

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}></div>
  );
}
