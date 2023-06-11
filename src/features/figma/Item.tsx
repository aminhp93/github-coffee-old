import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import useEditorStore from 'features/figma/store/EditorStore';
import { getTransformStyle } from './utils';
import ProcessView from './ProcessView';
import Component from './components/index';
import useHistoryStore from './store/HistoryStore';
import { get, cloneDeep } from 'lodash';

const useGesture = createUseGesture([dragAction, pinchAction]);

const Item = ({ id }: any) => {
  const items = useHistoryStore((state) => state.items);
  const patchItems = useHistoryStore((state) => state.patchItems);
  const mode = useEditorStore((state) => state.mode);

  const item = items[id];

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  const itemSpring = useSpring(() => ({
    x: item?.legacy?.itemProperties?.transform?.x || 0,
    y: item?.legacy?.itemProperties?.transform?.y || 0,
    transform:
      item?.type === 'item' ? getTransformStyle(item) : `translate(0, 0)`,
  }));

  const [style, api] = itemSpring;

  const ref = React.useRef<HTMLDivElement>(null);

  useGesture(
    {
      onDrag: ({ offset: [x, y], event, tap, first, last }) => {
        console.log('onDrag');
        event.stopPropagation();
        if (mode === 'pan') {
          if (item.type === 'view') {
            api.start({ x, y });
          }
        }

        if (mode === 'select') {
          if (item.type === 'item') {
            api.start({ x, y });
            if (first || tap) {
              const newItems = cloneDeep(items);

              if (!item.currentState?.selected) {
                Object.keys(items).forEach((itemId) => {
                  if (itemId === id) {
                    newItems[itemId] = {
                      currentState: {
                        selected: true,
                        itemSpring,
                      },
                    } as any;
                  } else {
                    newItems[itemId] = {
                      currentState: {
                        selected: false,
                      },
                    } as any;
                  }
                });
                patchItems(newItems);
              }
            }

            if (last && !tap) {
              patchItems({
                [item.id]: {
                  legacy: {
                    itemProperties: {
                      transform: {
                        x,
                        y,
                      },
                    },
                  },
                } as any,
              });
            }
          }
        }
      },
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
      },
    }
  );

  if (!item) return null;

  return (
    <div style={{}}>
      <animated.div
        ref={ref}
        style={{
          // boxSizing: 'content-box',
          // touchAction: 'none',
          // userSelect: 'none',
          // WebkitUserSelect: 'none',
          position: 'absolute',
          width:
            item.type === 'view'
              ? get(item, 'legacy.viewProperties.dimensions[0]')
              : 'unset',
          height:
            item.type === 'view'
              ? get(item, 'legacy.viewProperties.dimensions[1]')
              : 'unset',
          border: `${item?.currentState?.selected ? '2px solid red' : 'none'}`,
          ...style,
        }}
      >
        {item.type === 'view' ? (
          <ProcessView item={item}>
            {item.content.map((itemId: any) => {
              return <Item id={itemId} />;
            })}
          </ProcessView>
        ) : (
          <Component item={item} />
        )}
      </animated.div>
    </div>
  );
};

export default Item;
