import * as React from 'react';
import Note from 'pages/Note';

export interface IBashProfileProps {}

export default function BashProfile(props: IBashProfileProps) {
  return (
    <div>
      <Note id={7} />
    </div>
  );
}
