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

  const test = useEditorStore((state) => state.test);
  const setTest = useEditorStore((state) => state.setTest);
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

  const handleMerge = () => {
    setTest({
      2: {
        currentState: {
          frame: {
            x: 99,
            y: 99,
            width: 99,
            height: 99,
          },
        },
      } as any,
    });
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
        <Button onClick={handleMerge}>Merge</Button>
      </div>

      <Properties />
    </div>
  );
};

export default Test;
