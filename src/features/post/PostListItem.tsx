import { IPost } from 'types';

interface Props {
  data: IPost;
}

export default function PostListItem({ data }: Props) {
  return <div>{data.id}</div>;
}
