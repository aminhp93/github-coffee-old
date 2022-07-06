import Note from 'features/note/Note';

export interface IBashProfileProps {}

export default function BashProfile(props: IBashProfileProps) {
  return (
    <div>
      <Note id={7} />
    </div>
  );
}
