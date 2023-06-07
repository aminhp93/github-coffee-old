import { Item } from '../schema/item.schema';
import Rectangle from './Rectangle';
import Triangle from './Triangle';
import Circle from './Circle';
import { useEffect, useRef } from 'react';
import useHistoryStore from '../store/HistoryStore';

type Props = {
  item: Item;
};

const Component = ({ item }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const patchItems = useHistoryStore((state) => state.patchItems);

  useEffect(() => {
    const element = ref.current;
    if (!element || !element.firstChild) return;
    const rect = (element.firstChild as Element).getBoundingClientRect();
    const transform = item?.legacy?.itemProperties?.transform;
    const x = transform.x || 0;
    const y = transform.y || 0;
    const scale = transform?.scale || 1;
    patchItems({
      [item.id]: {
        currentState: {
          frame: {
            x,
            y,
            width: rect.width / scale,
            height: rect.height / scale,
          },
        },
      } as Item,
    });
  }, [item.id, item?.legacy?.itemProperties?.transform, patchItems]);

  const renderComponent = () => {
    if (item?.legacy?.itemType === 'Rectangle') {
      return <Rectangle item={item} />;
    } else if (item?.legacy?.itemType === 'Circle') {
      return <Circle item={item} />;
    } else if (item?.legacy?.itemType === 'Triangle') {
      return <Triangle item={item} />;
    }

    return null;
  };

  return renderComponent();
};

export default Component;
