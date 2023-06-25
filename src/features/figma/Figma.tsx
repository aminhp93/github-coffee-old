/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import useEditorStore from './store/EditorStore';
import useHistoryStore from './store/HistoryStore';
import Item from './Item';
import { Button } from 'antd';
import { LIST_ITEM } from './utils';
import { keyBy } from 'lodash';
import { ItemCollection } from './schema/item.schema';
import Properties from './Properties';

console.log(LIST_ITEM);
const objectItems = keyBy(LIST_ITEM, 'id');

const Test = () => {
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);
  const patchItems = useHistoryStore((state) => state.patchItems);
  const undo = useHistoryStore((state) => state.undo);
  const updateItems = useHistoryStore((state) => state.updateItems);
  const redo = useHistoryStore((state) => state.redo);
  const items = useHistoryStore((state) => state.items);

  useEffect(() => {
    setTimeout(() => {
      console.log('fetchData');
      Object.keys(objectItems).forEach((id) => {
        objectItems[id] = {
          ...objectItems[id],
          currentState: {
            selected: false,
            frame: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
            },
            itemSpring: null,
          },
        } as any;
      });
      updateItems(objectItems as ItemCollection);
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHotkeys(
    'shift',
    (event) => {
      event.preventDefault();
      console.log('ctrl pressed', event);
      if (event.type === 'keydown') {
        setMode('pan');
      }

      if (event.type === 'keyup') {
        setMode('select');
      }
    },
    {
      keydown: true,
      keyup: true,
    }
  );

  useHotkeys(
    'p',
    () => {
      console.log('p pressed');
      patchItems({
        '1': {
          legacy: {
            itemProperties: {
              transform: {
                zIndex: 100000,
              },
            },
          },
        } as any,
      });
      setMode('pan');
    },
    []
  );

  useHotkeys(
    's',
    () => {
      patchItems({
        '1': {
          legacy: {
            itemProperties: {
              transform: {
                zIndex: 0,
              },
            },
          },
        } as any,
      });
      console.log('s pressed');
      setMode('select');
    },
    []
  );

  useHotkeys(
    'v',
    () => {
      console.log('s pressed');
      setMode('view');
    },
    []
  );

  useHotkeys(
    'space',
    (event) => {
      event.preventDefault();
      if (event.type === 'keydown') {
        setMode('pan');
      }

      if (event.type === 'keyup') {
        setMode('select');
      }
    },
    {
      keydown: true,
      keyup: true,
    }
  );

  const handlePaste = () => {
    console.log('handlePaste');
  };

  const handleCopy = () => {
    console.log('handleCopy');
  };

  const handlePrevious = () => {
    console.log('handlePrevious');
    undo();
  };

  const handleNext = () => {
    console.log('handleNext');
    redo();
  };

  console.log('Test', test, items);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Item id={'1'} />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <div>Mode: {mode}</div>
        <Button onClick={handlePaste}>Paste</Button>
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>

      <Properties />
      <div
        style={{
          transform: `scale(1.5) rotate(${30}deg)`,
          border: '2px solid red',
          position: 'absolute',
          top: 100,
          left: 900,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${100}px solid transparent`,
            borderRight: `${100}px solid transparent`,
            borderBottom: `${100}px solid lightblue`,
          }}
        >
          <div>Triangle: </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
