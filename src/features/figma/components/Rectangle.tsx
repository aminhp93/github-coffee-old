import { Item } from '../schema/item.schema';

type Props = {
  item: Item;
};

const Rectangle = ({ item }: Props) => {
  return (
    <div
      style={{
        // top: item.property.y,
        // left: item.property.x,
        width: item?.legacy?.itemProperties?.transform?.width,
        height: item?.legacy?.itemProperties?.transform?.height,
        backgroundColor: 'lightblue',
      }}
      onClick={() => alert('rectangle')}
    >
      <div>Rectangle: {item.id}</div>
    </div>
  );
};

export default Rectangle;
