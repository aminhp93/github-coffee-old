import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';

import styles from './styles.module.css';
import { useHotkeys } from 'react-hotkeys-hook';
import useEditorStore from 'features/test/store';

const useGesture = createUseGesture([dragAction, pinchAction]);

const Count = () => {
  const [count, setCount] = React.useState(0);

  useHotkeys(
    'ctrl+k',
    () => {
      console.log('ctrl+k');
      setCount(count + 1);
    },
    [count]
  );

  return <div>Count {count}</div>;
};

const STYLES: any = {
  2: {
    x: 10,
    y: 10,
  },
  3: {
    x: 100,
    y: 100,
  },
  4: {
    x: 200,
    y: 200,
  },
};

const getItem = (id: number) => {
  if (id !== 1) {
    return {
      type: 'item',
      id,
      content: [],
      component: <Count />,
      style: STYLES[id],
    };
  }
  return {
    id: 1,
    type: 'view',
    content: [
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
    ],
  };
};

const Test = ({ id }: any) => {
  const item: any = getItem(id);
  const mode = useEditorStore((state) => state.mode);

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

  const [style, api] = useSpring(() => ({
    x: item?.style?.x || 0,
    y: item?.style?.y || 0,
    scale: 1,
    rotateZ: 0,
  }));

  const ref = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: any) => {
    console.log('click', id);
  };

  useGesture(
    {
      onDrag: ({ offset: [x, y], event, tap }) => {
        event.stopPropagation();
        console.log('drag', item?.id, tap);
        if (mode === 'pan') {
          if (item.type === 'view') {
            api.start({ x, y });
          }
        }

        if (mode === 'select') {
          if (item.type === 'item') {
            api.start({ x, y });
          }
        }
      },
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        // preventDefault: true,
        // stopPropagation: true,
        pointer: { lock: true },
        // filterTaps: true,
      },
    }
  );

  console.log('test');

  if (!item) return null;

  return (
    <animated.div
      className={item.type === 'view' ? styles.view : styles.item}
      ref={ref}
      style={style}
      onClick={handleClick}
    >
      {item.content.map((item: any) => {
        return <Test id={item.id} />;
      })}
      {item.component}
    </animated.div>
  );
};

export default Test;
