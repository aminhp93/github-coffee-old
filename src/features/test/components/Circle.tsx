import { Item } from '../schema/item.schema';

type Props = {
  item: Item;
};

const Circle = ({ item }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        // top: item.property.y,
        // left: item.property.x,
        width: item?.legacy?.itemProperties?.transform?.width,
        height: item?.legacy?.itemProperties?.transform?.width,
        backgroundColor: 'lightblue',
        borderRadius: '50%',
      }}
      onClick={() => alert('circle')}
    >
      <div>Circle: {item.id}</div>
    </div>
  );
};

export default Circle;
