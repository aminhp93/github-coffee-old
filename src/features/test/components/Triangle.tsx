import { Item } from '../schema/item.schema';

type Props = {
  item: Item;
};

const Triangle = ({ item }: Props) => {
  return (
    <div
      style={{
        // top: item.property.y,
        // left: item.property.x,
        width: 0,
        height: 0,
        borderLeft: `${
          (item?.legacy?.itemProperties?.transform?.height || 0) / 2
        }px solid transparent`,
        borderRight: `${
          (item?.legacy?.itemProperties?.transform?.height || 0) / 2
        }px solid transparent`,
        borderBottom: `${
          item?.legacy?.itemProperties?.transform?.width || 0
        }px solid lightblue`,
        // transform: `rotate(${30}deg)`,
      }}
      onClick={() => alert('triangle')}
    >
      <div>Triangle: {item.id}</div>
    </div>
  );
};

export default Triangle;
